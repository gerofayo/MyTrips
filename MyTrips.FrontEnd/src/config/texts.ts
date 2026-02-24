// src/config/texts.ts

export const TEXTS = {
  tripsList: {
    title: "My Journeys",
    subtitle: "Manage and track your travel budgets",
    loading: "Searching for your adventures...",
    emptyTitle: "No trips found",
    emptyBody:
      "You haven't planned any trips yet. Start organizing your next getaway and keep your expenses under control.",
    emptyCta: "Start Planning Now",
    createTripButton: "+ Create New Trip",
  },
  tripDetail: {
    loading: "Loading trip details...",
    notFound: "Trip not found.",
    editButton: "Edit Trip Details",
    itineraryTitle: "Itinerary",
    addExpense: "+ Add Expense",
    addExpenseCancel: "Cancel",
    deleteTripConfirm:
      "Are you sure you want to delete this entire trip? This action cannot be undone.",
    deleteTripDangerTitle: "Danger Zone",
    deleteTripDangerText:
      "Once you delete a trip, there is no going back. Please be certain.",
    deleteTripButton: "Delete Entire Trip",
    deleteItemConfirm: "Delete item?",
  },
  tripFormPage: {
    loading: "Loading trip data...",
    backToDetails: "Back to Trip Details",
    backToTrips: "Back to Your Trips",
    editTitle: "Edit Adventure",
    newTitle: "New Adventure",
    editSubtitle: "Update the details of your journey.",
    newSubtitle:
      "Fill in the details below to start planning your next getaway.",
  },
  tripForm: {
    mainTitleEdit: "Edit Trip Details",
    mainTitleCreate: "Plan a New Adventure",
    travelNameLabel: "Travel Name",
    travelNamePlaceholder: "e.g., Summer in Tokyo",
    destinationCountryLabel: "Destination Country",
    selectCountryPlaceholder: "Select country",
    timezoneLabel: "Timezone",
    timezonePlaceholderNoCountry: "Select country first",
    timezonePlaceholder: "Select timezone",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    dateError: "End date cannot be before start date",
    totalBudgetLabel: "Total Budget",
    totalBudgetPlaceholder: "0.00",
    currencyLabel: "Currency",
    currencyPlaceholder: "Select...",
    submitEdit: "Save Changes",
    submitCreate: "Create Trip",
  },
  budgetItemForm: {
    titleLabel: "Title",
    titlePlaceholder: "e.g. Daily Meals",
    amountLabel: "Amount",
    amountPerDayLabel: "Price p/Day",
    amountPlaceholder: "$ 0.00",
    categoryLabel: "Category",
    categoryPlaceholder: "Select Category...",
    timeLabel: "Time",
    multiDayLabel: "Multi-day expense?",
    durationLabel: "Duration",
    durationTotalPrefix: "Total: ",
    submitSaving: "Saving...",
    submitUpdate: "Update Item",
    submitCreate: "Add to budget",
  },
  budgetItemList: {
    unscheduledKey: "Unscheduled",
    unscheduledTitle: "Unscheduled Expenses",
    badgeMisc: "MISC",
    badgeDate: "DATE",
    emptySelection: "No activities logged for this selection.",
  },
  tripCalendar: {
    sectionLabel: "Trip Schedule",
    viewAllLabel: "VIEW",
    viewAllNumber: "All",
  },
  tripInfoCard: {
    remainingBudgetLabel: "Remaining Budget",
    totalSpentLabel: "Total Spent",
    categoryBreakdownLabel: "Category Breakdown",
    noExpensesText: "No expenses recorded yet.",
  },
} as const;

export type AppTexts = typeof TEXTS;

