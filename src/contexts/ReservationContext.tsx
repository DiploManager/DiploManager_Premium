import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

export interface Reservation {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  source: 'direct' | 'booking' | 'external';
  totalAmount: number;
  guests: number;
  specialRequests?: string;
  createdAt: string;
}

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  getReservationsByDate: (date: string) => Reservation[];
  loading: boolean;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};

interface ReservationProviderProps {
  children: ReactNode;
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar reservas iniciales y simular datos
    const loadInitialData = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const initialReservations: Reservation[] = [
        {
          id: '1',
          guestName: 'Juan Pérez',
          email: 'juan.perez@email.com',
          phone: '+57 300 123 4567',
          roomNumber: '101',
          roomType: 'Suite Deluxe',
          checkIn: now.toISOString().split('T')[0],
          checkOut: tomorrow.toISOString().split('T')[0],
          status: 'confirmed',
          source: 'direct',
          totalAmount: 250000,
          guests: 2,
          specialRequests: 'Cama extra',
          createdAt: now.toISOString(),
        },
        {
          id: '2',
          guestName: 'María García',
          email: 'maria.garcia@email.com',
          phone: '+57 301 987 6543',
          roomNumber: '205',
          roomType: 'Habitación Estándar',
          checkIn: tomorrow.toISOString().split('T')[0],
          checkOut: nextWeek.toISOString().split('T')[0],
          status: 'confirmed',
          source: 'booking',
          totalAmount: 180000,
          guests: 1,
          createdAt: now.toISOString(),
        },
        {
          id: '3',
          guestName: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@email.com',
          phone: '+57 302 456 7890',
          roomNumber: '302',
          roomType: 'Suite Presidencial',
          checkIn: nextWeek.toISOString().split('T')[0],
          checkOut: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending',
          source: 'external',
          totalAmount: 450000,
          guests: 3,
          specialRequests: 'Vista al mar, late check-out',
          createdAt: now.toISOString(),
        }
      ];

      setReservations(initialReservations);
      setLoading(false);
    };

    loadInitialData();

    // Simular reservas externas que llegan periódicamente
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de probabilidad cada 30 segundos
        const newReservation = generateMockReservation();
        setReservations(prev => [...prev, newReservation]);
        toast.success(`Nueva reserva recibida: ${newReservation.guestName}`);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const generateMockReservation = (): Reservation => {
    const names = ['Ana López', 'Diego Martín', 'Sofia Herrera', 'Miguel Torres', 'Laura Jiménez'];
    const rooms = ['103', '201', '304', '105', '208'];
    const roomTypes = ['Habitación Estándar', 'Suite Deluxe', 'Suite Junior'];
    
    const now = new Date();
    const checkIn = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    const checkOut = new Date(checkIn.getTime() + (1 + Math.floor(Math.random() * 5)) * 24 * 60 * 60 * 1000);
    
    const name = names[Math.floor(Math.random() * names.length)];
    
    return {
      id: Date.now().toString(),
      guestName: name,
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      phone: `+57 30${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
      roomNumber: rooms[Math.floor(Math.random() * rooms.length)],
      roomType: roomTypes[Math.floor(Math.random() * roomTypes.length)],
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      status: 'confirmed',
      source: 'external',
      totalAmount: Math.floor(Math.random() * 300000) + 150000,
      guests: Math.floor(Math.random() * 4) + 1,
      createdAt: now.toISOString(),
    };
  };

  const addReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setReservations(prev => [...prev, newReservation]);
    toast.success('Reserva creada exitosamente');
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === id ? { ...reservation, ...updates } : reservation
      )
    );
    toast.success('Reserva actualizada');
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== id));
    toast.success('Reserva eliminada');
  };

  const getReservationsByDate = (date: string) => {
    return reservations.filter(reservation => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      const targetDate = new Date(date);
      
      return targetDate >= checkIn && targetDate < checkOut;
    });
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        addReservation,
        updateReservation,
        deleteReservation,
        getReservationsByDate,
        loading,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};