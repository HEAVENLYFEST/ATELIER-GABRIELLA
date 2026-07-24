import { DayPicker } from 'react-day-picker'
import { fr } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import './RdvCalendar.css'

const timeSlots = ['10h-11h', '11h-12h', '12h-13h', '13h-14h', '14h-15h', '15h-16h', '16h-17h', '17h-18h', '18h-19h']

export default function RdvCalendar({ selectedDate, selectedSlot, onDateChange, onSlotChange }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

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
    {selectedDate && <div className="rdv-calendar__slots" aria-label="Créneaux disponibles">{timeSlots.map(slot => <button type="button" key={slot} className={selectedSlot === slot ? 'is-selected' : ''} onClick={() => onSlotChange(slot)}>{slot}</button>)}</div>}
  </section>
}
