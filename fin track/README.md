# FinTrack - Personal Finance Management App

A modern, responsive personal finance management application built with React, TypeScript, and Tailwind CSS.

## Features

- 💰 **Transaction Management**: Add, edit, and delete income and expense transactions
- 📊 **Data Visualization**: Interactive charts and graphs for financial insights
- 🏦 **Multi-Account Support**: Manage multiple bank accounts and credit cards
- 📈 **Budget Tracking**: Set and monitor budget limits for different categories
- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support
- 📱 **Mobile-First**: Optimized for mobile devices with touch-friendly interface
- 💾 **Data Persistence**: Local storage for data persistence
- 📤 **Export/Import**: Backup and restore your financial data

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Backend**: Supabase (optional)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fintrack-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # Radix UI component implementations
├── supabase/           # Backend functions (optional)
├── styles/             # Global styles
├── utils/              # Utility functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global CSS styles
```

## Usage

1. **Add Transactions**: Click the "+" button to add new income or expense transactions
2. **Manage Accounts**: Go to the Wallets tab to add, edit, or delete accounts
3. **View Statistics**: Check the Stats tab for visual insights into your spending
4. **Set Budgets**: Use the sidebar menu to manage budget categories and limits
5. **Export Data**: Use the sidebar menu to export your data for backup

## Features in Detail

### Transaction Management
- Add income and expense transactions with categories
- Edit existing transactions
- Delete transactions with confirmation
- Filter by date, category, and account

### Account Management
- Multiple account support (checking, savings, credit cards)
- Real-time balance updates
- Currency support (JPY, USD, EUR, etc.)

### Budget Tracking
- Set monthly budget limits for categories
- Visual progress indicators
- Overspending alerts

### Data Visualization
- Pie charts for expense breakdown by category
- Line charts for income vs expense trends
- Bar charts for monthly comparisons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub.
