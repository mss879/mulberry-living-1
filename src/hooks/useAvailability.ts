import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isWithinInterval, parseISO, startOfDay, isBefore, isSameDay } from 'date-fns';

export type BookingData = {
  id: string;
  stay_id: string;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  quantity: number;
  status: string;
};

// Generic stay type to handle the minimal data we need for calculation
type StayData = {
  id: string;
  inventory_total?: number | null;
  inventory_available?: number;
};

/**
 * Fetches all confirmed bookings that haven't checked out yet.
 */
export function useAllConfirmedBookings() {
  return useQuery({
    queryKey: ['confirmed_bookings'],
    queryFn: async () => {
      const todayString = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('bookings')
        .select('id, stay_id, check_in, check_out, quantity, status')
        .eq('status', 'confirmed')
        .gte('check_out', todayString); // Only current & future bookings
      
      if (error) throw error;
      return (data as BookingData[]) || [];
    },
    // We want this data to stay fresh, refetch every 3 mins
    refetchInterval: 180000, 
  });
}

/**
 * Calculates availability for a specific date.
 */
export function getAvailabilityOnDate(
  date: Date,
  stay: StayData,
  bookings: BookingData[]
): { availableCount: number; isAvailable: boolean } {
  // If there's no inventory total defined, fallback to inventory_available or 1
  const maxInventory = stay.inventory_total ?? stay.inventory_available ?? 1;

  // Filter bookings for this specific stay
  const stayBookings = bookings.filter((b) => b.stay_id === stay.id);

  // Sum up quantities of all bookings overlapping this date
  const targetDate = startOfDay(date);
  
  const occupiedCount = stayBookings.reduce((sum, booking) => {
    // Note: check_out date means they leave that morning, so the night *before* is the last booked night.
    // If a date is exactly the check_out date, the room is actually considered available for check-in.
    const checkInDate = startOfDay(parseISO(booking.check_in));
    const checkOutDate = startOfDay(parseISO(booking.check_out));

    // Date falls within check_in (inclusive) and check_out (exclusive)
    if (
      (isSameDay(targetDate, checkInDate) || isBefore(checkInDate, targetDate)) &&
      isBefore(targetDate, checkOutDate)
    ) {
      return sum + (booking.quantity || 1);
    }
    return sum;
  }, 0);

  const availableCount = Math.max(0, maxInventory - occupiedCount);
  return { availableCount, isAvailable: availableCount > 0 };
}

/**
 * Validates if an entire date range has enough inventory.
 */
export function isDateRangeAvailable(
  checkIn: Date,
  checkOut: Date,
  requestedQuantity: number,
  stay: StayData,
  bookings: BookingData[]
): boolean {
  if (isBefore(checkOut, checkIn) || isSameDay(checkIn, checkOut)) return false;

  let currentDate = startOfDay(checkIn);
  const end = startOfDay(checkOut);

  // Check every night in the range
  while (isBefore(currentDate, end)) {
    const { availableCount } = getAvailabilityOnDate(currentDate, stay, bookings);
    if (availableCount < requestedQuantity) {
      return false;
    }
    // Move to next day
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  return true;
}

/**
 * Gets the "Booked until" date if a stay is fully booked today.
 */
export function getNextAvailableDate(
  stay: StayData,
  bookings: BookingData[]
): Date | null {
  const today = startOfDay(new Date());
  
  // First check if it's available today
  if (getAvailabilityOnDate(today, stay, bookings).availableCount > 0) {
    return null; // It IS available
  }

  // If not available, find the earliest checkOut date of the currently active bookings 
  // that would free up at least 1 unit.
  
  const stayBookings = bookings.filter((b) => b.stay_id === stay.id);
  
  // A simple heuristic for small inventories:
  // Find all check-out dates of active bookings, sort them ascending.
  // The earliest check-out date where availability > 0 is our winner.
  const activeBookings = stayBookings.filter((b) => {
     const checkInDate = startOfDay(parseISO(b.check_in));
     const checkOutDate = startOfDay(parseISO(b.check_out));
     return (isSameDay(today, checkInDate) || isBefore(checkInDate, today)) && isBefore(today, checkOutDate);
  });

  const checkOutDates = activeBookings
    .map(b => startOfDay(parseISO(b.check_out)))
    .sort((a, b) => a.getTime() - b.getTime());

  for (const date of checkOutDates) {
    if (getAvailabilityOnDate(date, stay, bookings).availableCount > 0) {
      return date;
    }
  }

  // Fallback (e.g. if one giant booking consumes all)
  return checkOutDates[0] || null;
}
