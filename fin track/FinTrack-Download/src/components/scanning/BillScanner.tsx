import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import Tesseract from 'tesseract.js'
import { Camera, Upload, X, Check, Loader2, FileText, DollarSign, Store, Calendar } from 'lucide-react'

interface ScannedData {
  amount?: number
  merchant?: string
  date?: string
  category?: string
  confidence: number
  rawText: string
}

interface BillScannerProps {
  onScanComplete: (data: ScannedData) => void
  onClose: () => void
}

export const BillScanner: React.FC<BillScannerProps> = ({ onScanComplete, onClose }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<ScannedData | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const webcamRef = useRef<Webcam>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setPreviewImage(imageSrc)
      processImage(imageSrc)
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string
        setPreviewImage(imageSrc)
        processImage(imageSrc)
      }
      reader.readAsDataURL(file)
    }
  }

  const processImage = async (imageSrc: string) => {
    setIsScanning(true)
    setError(null)

    try {
      const { data: { text, confidence } } = await Tesseract.recognize(
        imageSrc,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
            }
          }
        }
      )

      const parsedData = parseReceiptText(text)
      const result: ScannedData = {
        ...parsedData,
        confidence: confidence / 100,
        rawText: text
      }

      setScannedData(result)
    } catch (err) {
      console.error('OCR Error:', err)
      setError('Failed to process image. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const parseReceiptText = (text: string): Partial<ScannedData> => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    // Extract amount (look for currency patterns)
    const amountPatterns = [
      /\$(\d+\.?\d*)/g,
      /(\d+\.?\d*)\s*USD/g,
      /Total[:\s]*\$?(\d+\.?\d*)/gi,
      /Amount[:\s]*\$?(\d+\.?\d*)/gi,
      /(\d+\.?\d*)\s*JPY/g,
      /(\d+\.?\d*)\s*EUR/g
    ]
    
    let amount: number | undefined
    for (const pattern of amountPatterns) {
      const matches = text.match(pattern)
      if (matches) {
        const amounts = matches.map(match => {
          const num = match.replace(/[^\d.]/g, '')
          return parseFloat(num)
        }).filter(num => !isNaN(num) && num > 0)
        
        if (amounts.length > 0) {
          amount = Math.max(...amounts) // Take the largest amount (likely total)
          break
        }
      }
    }

    // Extract merchant (usually first few lines or contains common business words)
    const merchantPatterns = [
      /^([A-Z][A-Za-z\s&]+)$/m,
      /(?:Store|Shop|Restaurant|Cafe|Market|Mart|Center|Inc|LLC|Corp)/i
    ]
    
    let merchant: string | undefined
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i]
      if (line.length > 3 && line.length < 50 && 
          !line.match(/\d/) && 
          !line.match(/(total|subtotal|tax|discount|amount)/i)) {
        merchant = line
        break
      }
    }

    // Extract date (look for date patterns)
    const datePatterns = [
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s,]*\d{1,2}[\s,]*\d{2,4}/gi
    ]
    
    let date: string | undefined
    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match) {
        date = match[0]
        break
      }
    }

    // Determine category based on merchant and amount
    const category = determineCategory(merchant || '', amount || 0)

    return { amount, merchant, date, category }
  }

  const determineCategory = (merchant: string, amount: number): string => {
    const merchantLower = merchant.toLowerCase()
    
    if (merchantLower.includes('grocery') || merchantLower.includes('market') || 
        merchantLower.includes('food') || merchantLower.includes('supermarket')) {
      return 'Food'
    }
    if (merchantLower.includes('gas') || merchantLower.includes('fuel') || 
        merchantLower.includes('station') || merchantLower.includes('oil')) {
      return 'Transport'
    }
    if (merchantLower.includes('restaurant') || merchantLower.includes('cafe') || 
        merchantLower.includes('diner') || merchantLower.includes('pizza')) {
      return 'Food'
    }
    if (merchantLower.includes('pharmacy') || merchantLower.includes('medical') || 
        merchantLower.includes('health') || merchantLower.includes('clinic')) {
      return 'Health'
    }
    if (merchantLower.includes('electric') || merchantLower.includes('water') || 
        merchantLower.includes('utility') || merchantLower.includes('power')) {
      return 'Utilities'
    }
    if (merchantLower.includes('store') || merchantLower.includes('shop') || 
        merchantLower.includes('mall') || merchantLower.includes('retail')) {
      return 'Shopping'
    }
    
    // Default based on amount
    if (amount > 1000) return 'Shopping'
    if (amount > 100) return 'Food'
    return 'Other'
  }

  const handleAccept = () => {
    if (scannedData) {
      onScanComplete(scannedData)
    }
  }

  const handleRetake = () => {
    setPreviewImage(null)
    setScannedData(null)
    setError(null)
  }

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment" // Use back camera
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Scan Bill/Receipt
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {!previewImage ? (
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white rounded-lg w-48 h-32 opacity-50"></div>
                </div>
              </div>

              {/* Upload Option */}
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
              </div>

              {/* Capture Button */}
              <div className="text-center">
                <button
                  onClick={capturePhoto}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Photo</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview Image */}
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Captured receipt"
                  className="w-full h-64 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg"
                />
                {isScanning && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>Processing image...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Scanned Data */}
              {scannedData && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
                    Extracted Information
                  </h4>
                  <div className="space-y-2">
                    {scannedData.amount && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800 dark:text-blue-200">
                          Amount: ${scannedData.amount}
                        </span>
                      </div>
                    )}
                    {scannedData.merchant && (
                      <div className="flex items-center space-x-2">
                        <Store className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800 dark:text-blue-200">
                          Merchant: {scannedData.merchant}
                        </span>
                      </div>
                    )}
                    {scannedData.date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800 dark:text-blue-200">
                          Date: {scannedData.date}
                        </span>
                      </div>
                    )}
                    {scannedData.category && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800 dark:text-blue-200">
                          Category: {scannedData.category}
                        </span>
                      </div>
                    )}
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Confidence: {Math.round(scannedData.confidence * 100)}%
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleRetake}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium"
                >
                  Retake
                </button>
                {scannedData && (
                  <button
                    onClick={handleAccept}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Use This Data</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
