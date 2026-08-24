import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { fr } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import './RdvCalendar.css'

const timeSlots = ['10h-11h', '11h-12h', '12h-13h', '13h-14h', '14h-15h', '15h-16h', '16h-17h', '17h-18h', '18h-19h']

export const toISODate = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function RdvCalendar({ selectedDate, selectedSlot, onDateChange, onSlotChange }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [bookedSlots, setBookedSlots] = useState([])

  useEffect(() => {
    fetch('/api/slots')
      .then(response => (response.ok ? response.json() : []))
      .then(setBookedSlots)
      .catch(() => setBookedSlots([]))
  }, [])

  const takenSlots = selectedDate
    ? bookedSlots.filter(booking => booking.date === toISODate(selectedDate)).map(booking => booking.slot)
    : []

  return <section className="rdv-calendar" aria-labelledby="rdv-title">
    <p id="rdv-title" className="rdv-calendar__label">Choisissez un créneau de rendez-vous</p>
    <DayPicker
      animate
      className="rdv-calendar__picker"
      locale={fr}
      mode="single"
      selected={selectedDate}
      onSelect={date => { onDateChange(date); onSlotChange('') }}
      disabled={[{ before: today }, { dayOfWeek: [0] }]}
      startMonth={today}
      hideHead
    />
    {selectedDate && <div className="rdv-calendar__slots" aria-label="Créneaux disponibles">{timeSlots.map(slot => {
      const isTaken = takenSlots.includes(slot)
      const isSelected = selectedSlot === slot
      return <button type="button" key={slot} className={`${isSelected ? 'is-selected' : ''} ${isTaken ? 'is-taken' : ''}`} disabled={isSelected || isTaken} aria-pressed={isSelected} onClick={() => onSlotChange(slot)}>{isTaken ? `${slot} (pris)` : slot}</button>
    })}</div>}
  </section>
}
