export const sidenavMenuItems = [
    {
        id: 'Master', name: 'Master', icon: 'grade', url: '#',
        children: [
            { id: 'AccountHead', name: 'Account Head', icon: '', url: '/master/accounthead' },
            { id: 'MenuSettings', name: 'Menu Settings', icon: '', url: '/settings/mastersettings' },
            { id: 'Branch', name: 'Branch', icon: '', url: '/master/branch' },
            { id: 'Area', name: 'Area', icon: '', url: '/master/area' },
            { id: 'manufacture', name: 'Manufacture', icon: '', url: '/master/manufacture' },
            { id: 'BackupTaken', name: 'Backup Taken', icon: '', url: '/master/backuptaken' },
            { id: 'CategoryHead', name: 'CategoryHead', icon: '', url: '/master/categoyhead' },
            { id: 'Category', name: 'Category', icon: '', url: '/master/category' },
            { id: 'Product', name: 'Product', icon: '', url: '/master/product' },
            { id: 'AddTable', name: 'Add Tables', icon: '', url: '/master/addtable' },
            { id: 'TableDetails', name: 'Table Details', icon: '', url: '/master/tabeldetails' },
            { id: 'ProductCorrection', name: 'Product Correction', icon: '', url: '/master/productcorrection' }
        ]
    },
    {
        id: 'Settings', name: 'Settings', icon: 'settings', url: '#',
        children: [

            // { id: 'Settings', name: 'Settings', icon: '',  url: '/settings/codemenusettings' },
            { id: 'MasterMenuSettings', name: 'Menu Settings', icon: '', url: '/settings/codemenusettings' },
            { id: 'softwaresettings', name: 'Settings New', icon: '', url: '/settings/softwaresettings' }
        ]
    },
    {
        id: 'Booking', name: 'Booking', icon: 'book', url: '#',
        children: [
            { id: 'RoomRegistration', name: 'Room Registration', icon: '', url: '/booking/roomregister' },
            { id: 'RoomSettlement', name: ' Room Settlement ', icon: '', url: '/booking/roomsettlement' },
            { id: 'Floor', name: 'Floor', icon: '', url: '/booking/floor' },
            { id: 'RoomType', name: 'Room Type', icon: '', url: '/booking/roomtype' },
            { id: 'Room', name: 'Room', icon: '', url: '/booking/room' },
            { id: 'Identification', name: 'Identification', icon: '', url: '/booking/identification' },
        ]
    },
    {
        id: 'Restaurant', name: 'Restaurant', icon: 'restaurant', url: '#',
        children: [
            { id: 'KotTouch', name: 'POS', icon: '', url: '/restarunt/pos' },
            // { id: 'PosMobile', name: 'POS Mobile', icon: '',  url: '' }, 
            { id: 'KotList', name: 'Kot List', icon: '', url: '/restarunt/kot-list' },
            { id: 'BillList', name: 'Bill List', icon: '', url: '/restarunt/bill-list' },
            { id: 'KotNotSupplyList', name: 'Kot NotSupply List', icon: '', url: '/restarunt/' },
        ]
    },

    {
        id: 'Supplier', name: 'Supplier', icon: 'local_grocery_store', url: '#',
        children: [
            { id: 'purchase', name: 'Purchase Bill', icon: '', url: '/supplier/purchase' },
            { id: 'PurCorrection', name: 'Purchase Correction', icon: '', url: '/supplier/correction' },
            { id: 'PurReturn', name: 'Purchase Return', icon: '', url: '/supplier' },
            { id: 'DebitNote', name: 'Debit Note', icon: '', url: '/supplier' },

        ]
    },
    {
        id: 'Accounts', name: 'Accounts', icon: 'menu_book', url: '#',
        children: [
            {
                id: 'Entry', name: 'Entry', icon: '', url: '',
                children: [
                    { id: 'RecieptVoucher', name: 'Receipt Voucher', icon: '', url: '/accounts/receiptvoucher' },
                    { id: 'PaymentVoucher', name: 'Payment Voucher', icon: '', url: '/accounts/paymentvoucher' },
                    { id: 'BankReConci', name: 'Bank Reconcilation', icon: '', url: '/accounts/bankreconcilation' },
                    { id: 'ContraEntry', name: 'Contra Entry', icon: '', url: '/accounts/contraentry' },
                    { id: 'ExpenseEntry', name: 'Expense Entry', icon: '', url: '/accounts/expenseentry' },
                    { id: 'ExpenseItem', name: 'Expense Items', icon: '', url: '/accounts/expenseitem' },
                    { id: 'JournalVoucher', name: 'Journal Voucher', icon: '', url: '/accounts' },
                    { id: 'openingBalEntry', name: 'Opening Balance Entry', icon: '', url: 'accounts/openingbalanceentry' },
                ]
            },
            {
                id: 'AccountReport', name: 'Report', icon: '', url: '',
                children: [
                    { id: 'LedgerReport', name: 'Ledger Report', icon: '', url: 'accounts/ledger' },
                    { id: 'DebitorsAsOnDate', name: 'Debitors As On Date', icon: '', url: 'accounts/debitorsasondate' },
                    { id: 'CreditorsAsOnDate', name: 'Creditors As On Date', icon: '', url: 'accounts/creditorsasondate' },
                    { id: 'SalesManWiseCollections', name: 'SalesManWise Collections', icon: '', url: 'accounts/salesmanwisecollection' },
                    { id: 'VoucherTypeReport', name: 'Vouchertype Report', icon: '', url: 'accounts/vouchertypereport' },
                    { id: 'DayBook', name: 'Day Book', icon: '', url: 'accounts/daybook' },
                    { id: 'CashBook', name: 'Cash Book', icon: '', url: 'accounts/cashbook' },
                    { id: 'BankBook', name: 'Bank Book', icon: '', url: 'accounts/bankbook' },
                    { id: 'TrialBalance', name: 'Trial Balance', icon: '', url: 'accounts/trialbalance' },
                    { id: 'ProfitAndLose', name: 'Profit And Lose', icon: '', url: 'accounts/profitandloss' },
                    { id: 'BalanceSheet', name: 'Balance Sheet', icon: '', url: 'accounts/balancesheet' },
                    { id: 'TransactionReport', name: 'Trans Report', icon: '', url: 'accounts/transactionreport' },
                    { id: 'ExpenseEntryReport', name: 'Expense Entry', icon: '', url: 'accounts/expenseentryreport' },
                    { id: 'TDSReport', name: 'TDS Report', icon: '', url: 'accounts/tdsreport' },
                    { id: 'AdjustmentReport', name: 'Adjustment Report', icon: '', url: 'accounts/adjustmentreport' },
                    { id: 'OutstandingLedger', name: 'Outstanding Ledger Report', icon: '', url: 'accounts/outstandingledgercompare' },
                ]
            },
            { id: 'TallyLink', name: 'Tally Link', icon: '', url: 'accounts' },
        ]
    },
    {
        id: 'Reports', name: 'Reports', icon: 'receipt', url: '#',
        children: [
            {
                id: 'SalesReport', name: 'Sales Report', icon: '', url: '',
                children: [
                    { id: 'Dailysales', name: 'Daily sales', icon: '', url: '/report/dailysales' },
                    { id: 'CategorySales', name: 'Category Sales', icon: '', url: '/report/categorysales' },
                    { id: 'ProductSales', name: 'Product Sales', icon: '', url: '/report/productsales' },
                    { id: 'Salesmanwisesales', name: 'SalesManWise Sales', icon: '', url: '/report/salesmanproductwise' },
                    { id: 'CompanyWiseSales', name: 'CompanyWise Sales', icon: '', url: '/report/companywisesales' },
                    { id: 'MonthWiseSales', name: 'MonthWise Sales', icon: '', url: '/report/customermonthwisesalessummary' },
                ]
            },
            {
                id: 'PurchaseReport', name: 'Purchase Report', icon: '', url: '',
                children: [
                    { id: 'DateWisePurchase', name: 'DateWise Purchase', icon: '', url: '/report/datewisepurchase' },
                    { id: 'SupplierWisePurchase', name: 'SupplierWise Purchase', icon: '', url: '/report/supplierwisepurchasereport' },
                    { id: 'CompanyWisePurchase', name: 'CompanyWise Purchase', icon: '', url: '/report/companywisepurchase' },
                    { id: 'ProductWisePurchase', name: 'ProductWise Purchase', icon: '', url: '/report/productwisepurchase' },
                ]
            },
            {
                id: 'GstTaxReports', name: 'Tax Report', icon: '', url: '',
                children: [
                    { id: 'GstTaxReport', name: 'Gst Tax Reports', icon: '', url: '/report/gsttaxreport' },
                    { id: 'GstSalesReports', name: 'Gst Sales Reports', icon: '', url: '/report/gstsalesreport' },
                ]
            },
            {
                id: 'StockReport', name: 'Stock Report', icon: '', url: '',
                children: [
                    { id: 'StockReports', name: 'Stock Reports', icon: '', url: '/report/stockreport' },
                    { id: 'CompanyWiseStock', name: 'CompanyWise Stock', icon: '', url: '/report/companywisestock' },
                    { id: 'RolItemsList', name: 'ROL Items List', icon: '', url: '/report/rolstock' },
                    { id: 'NillStockReport', name: 'Nill Stock', icon: '', url: '/report/nillstockreport' },
                    { id: 'CategoryWiseStock', name: 'CategoryWise Stock', icon: '', url: '/report/categorywisestock' },
                    { id: 'NonMovingItems', name: 'Non Moving Items', icon: '', url: '/report/nonmovingitem' },
                ]
            },
        ]
    },
    {
        id: 'EmpPayroll', name: 'Employee Payroll', icon: 'library_books', url: '#',
        children: [
            { id: 'Qualification', name: 'Qualification', icon: '', url: 'employee' },
            { id: 'EmpCategory', name: 'EmpCategory', icon: '', url: 'employee' },
            { id: 'WorkArea', name: 'WorkArea', icon: '', url: 'employee' },
            { id: 'JobPlace', name: 'Job Place', icon: '', url: 'employee' },
            { id: 'EmpRegistration', name: 'Employee Registration', icon: '', url: 'employee' },
            { id: 'AttenRegister', name: 'Attendance Register', icon: '', url: 'employee' },
            { id: 'SalaryEntry', name: 'Salary Entry', icon: '', url: 'employee' },
            { id: 'AttenRegReport', name: 'Attendance Register Report', icon: '', url: 'employee' },
            { id: 'SalReport', name: 'Salary Report', icon: '', url: 'employee' },
        ]
    }
]