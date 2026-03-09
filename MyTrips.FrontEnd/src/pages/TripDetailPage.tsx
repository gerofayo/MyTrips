import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useTrip } from "../hooks/useTrip";
import { useBudgetItems } from "../hooks/useBudgetItems";
import { TripHero } from "../components/TripHero";
import { TripInfoCard } from "../components/TripInfoCard";
import { TripCalendar } from "../components/TripCalendar";
import { BudgetItemList } from "../components/BudgetItemList";
import { BudgetItemForm } from "../components/BudgetItemForm";
import type { BudgetItem, CreateBudgetItemRequest } from "../types/BudgetItem";
import { deleteTrip } from "../services/tripService";
import { PATHS } from "../routes/paths";
import { logger } from "../utils/logger";
import { TEXTS } from "../config/texts";
import "../styles/pages/TripDetailPage.css";

type TabId = "budget" | "map" | "photos" | "settings";

export default function TripDetailPage() {
  const { id: tripId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { trip, loading: tripLoading } = useTrip(tripId);
  const { items, createItem, updateItem, deleteItem, isSubmitting, loading: loadingItems } = useBudgetItems(tripId!);

  const [activeTab, setActiveTab] = useState<TabId>("budget");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  const displayedItems = useMemo(() => {
    if (!selectedDate) return items;
    return items.filter(item => item.date?.split('T')[0] === selectedDate);
  }, [items, selectedDate]);

  const handleDeleteTrip = async () => {
    if (!window.confirm(TEXTS.tripDetail.deleteTripConfirm)) return;
    
    try {
      await deleteTrip(tripId!);
      logger.info(`Trip deleted: ${tripId}`);
      navigate(PATHS.TRIPS_LIST, { replace: true });
    } catch (error) {
      logger.error("Error deleting trip", error);
      alert("Error deleting trip. Please try again.");
    }
  };

  const handleEditItem = (item: BudgetItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: CreateBudgetItemRequest) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, formData);
      } else {
        await createItem(formData);
      }
      setEditingItem(null);
      setShowForm(false);
    } catch (error) {
      logger.error("Error submitting budget item", error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (tripLoading) return (
    <div className="loading-container">
      <p className="section-label">{TEXTS.tripDetail.loading}</p>
    </div>
  );

  if (!trip) {
    return (
      <div className="app-container not-found-container">
        <div className="not-found-content">
          <p className="not-found-text">{TEXTS.tripDetail.notFound}</p>
          <button 
            className="button" 
            onClick={() => navigate(PATHS.TRIPS_LIST)}
          >
            ← Back to My Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-detail">
      <div className="app-container trip-detail-wrapper">
        
        {/* Hero with back button */}
        <div className="hero-wrapper">
          <TripHero trip={trip} />
          <div className="hero-floating-actions">
            <button
              className="floater-btn"
              onClick={() => navigate(PATHS.TRIPS_LIST)}
              title="Back"
            >
              <Icon icon="mdi:arrow-left" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="tab-nav">
          <button 
            className={`tab-btn ${activeTab === "budget" ? "active" : ""}`}
            onClick={() => setActiveTab("budget")}
          >
            <Icon icon="mdi:wallet-outline" />
            <span>Budget</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === "map" ? "active" : ""}`}
            onClick={() => setActiveTab("map")}
          >
            <Icon icon="mdi:map-marker-outline" />
            <span>Map</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === "photos" ? "active" : ""}`}
            onClick={() => setActiveTab("photos")}
          >
            <Icon icon="mdi:image-multiple-outline" />
            <span>Photos</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Icon icon="mdi:cog-outline" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Content based on active tab */}
        <div className="tab-content-wrapper">
          
          {/* BUDGET TAB - Includes Calendar */}
          {activeTab === "budget" && (
            <div className="tab-content">
              {/* Budget Summary */}
              <div className="budget-summary-section">
                <TripInfoCard trip={trip} items={items} />
              </div>

              {/* Calendar Strip */}
              <div className="calendar-strip-section">
                <TripCalendar
                  startDate={trip.startDate}
                  endDate={trip.endDate}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>

              {/* Add Expense Button */}
              <div className="budget-actions">
                <button
                  className={`btn-add ${showForm ? "cancel" : ""}`}
                  onClick={showForm ? handleCancelForm : () => setShowForm(true)}
                >
                  <Icon icon={showForm ? "mdi:close" : "mdi:plus"} />
                  {showForm ? "Cancel" : "Add Expense"}
                </button>
              </div>

              {/* Expense Form */}
              <div className={`expense-form ${showForm ? "expanded" : "collapsed"}`}>
                <BudgetItemForm
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                  selectedDate={selectedDate}
                  initialData={editingItem}
                />
              </div>

              {/* Budget Items List */}
              <div className="expenses-list-section">
                <BudgetItemList
                  items={displayedItems}
                  onDelete={async (id) => {
                    if (window.confirm(TEXTS.tripDetail.deleteItemConfirm)) {
                      try {
                        await deleteItem(id);
                      } catch (error) {
                        logger.error("Error deleting budget item", error);
                        alert("Error deleting item. Please try again.");
                      }
                    }
                  }}
                  onEdit={handleEditItem}
                  isSubmitting={loadingItems}
                  selectedDate={selectedDate}
                />
              </div>
            </div>
          )}

          {/* MAP TAB - Placeholder */}
          {activeTab === "map" && (
            <div className="tab-content placeholder-tab">
              <div className="placeholder-content">
                <Icon icon="mdi:map-marker-outline" className="placeholder-icon" />
                <h3>Trip Map</h3>
                <p>Map view is coming soon. You'll be able to see all your trip locations here.</p>
              </div>
            </div>
          )}

          {/* PHOTOS TAB - Placeholder */}
          {activeTab === "photos" && (
            <div className="tab-content placeholder-tab">
              <div className="placeholder-content">
                <Icon icon="mdi:image-multiple-outline" className="placeholder-icon" />
                <h3>Trip Photos</h3>
                <p>Photo gallery is coming soon. Upload and organize your trip memories here.</p>
              </div>
            </div>
          )}

          {/* SETTINGS TAB - Edit & Delete */}
          {activeTab === "settings" && (
            <div className="tab-content settings-tab">
              <div className="settings-section">
                <h3 className="settings-title">Trip Settings</h3>
                <p className="settings-subtitle">Manage your trip details</p>
                
                <div className="settings-actions">
                  <button 
                    className="settings-action-btn"
                    onClick={() => navigate(PATHS.EDIT_TRIP(tripId!))}
                  >
                    <Icon icon="mdi:pencil-outline" />
                    <div className="settings-action-text">
                      <span className="settings-action-title">Edit Trip</span>
                      <span className="settings-action-desc">Change destination, dates, budget</span>
                    </div>
                    <Icon icon="mdi:chevron-right" className="settings-chevron" />
                  </button>

                  <button 
                    className="settings-action-btn danger"
                    onClick={handleDeleteTrip}
                  >
                    <Icon icon="mdi:trash-can-outline" />
                    <div className="settings-action-text">
                      <span className="settings-action-title">Delete Trip</span>
                      <span className="settings-action-desc">Permanently remove this trip</span>
                    </div>
                    <Icon icon="mdi:chevron-right" className="settings-chevron" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

