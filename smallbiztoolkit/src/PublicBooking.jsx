import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from './supabaseClient'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0c0c0f; }

  .pb-wrap {
    min-height: 100vh;
    background: #0c0c0f;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 20px;
  }

  .pb-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 18px;
    color: #6b6b78;
    margin-bottom: 40px;
    letter-spacing: -0.5px;
  }
  .pb-logo span { color: #f5a623; }

  .pb-card {
    background: #13131a;
    border: 1px solid #1e1e26;
    border-radius: 20px;
    padding: 36px;
    width: 100%;
    max-width: 480px;
  }

  .pb-biz { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 4px; }
  .pb-service { font-size: 14px; color: #6b6b78; margin-bottom: 28px; }

  .pb-section-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #6b6b78;
    margin-bottom: 12px;
  }

  .pb-slots {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 24px;
  }

  .pb-slot {
    padding: 12px 8px;
    background: #0c0c0f;
    border: 1px solid #1e1e26;
    border-radius: 10px;
    text-align: center;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
  }
  .pb-slot:hover { border-color: #f5a623; color: #f5a623; }
  .pb-slot.selected { border-color: #f5a623; background: #f5a6231a; color: #f5a623; font-weight: 600; }
  .pb-slot.booked { opacity: 0.3; pointer-events: none; text-decoration: line-through; }

  .pb-divider { height: 1px; background: #1e1e26; margin: 24px 0; }

  .pb-field { margin-bottom: 16px; }
  .pb-label { display: block; font-size: 12px; font-weight: 500; color: #6b6b78; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .pb-input {
    width: 100%;
    background: #0c0c0f;
    border: 1px solid #1e1e26;
    border-radius: 10px;
    padding: 12px 14px;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .pb-input:focus { border-color: #f5a623; }

  .pb-btn {
    width: 100%;
    background: #f5a623;
    color: #0c0c0f;
    border: none;
    border-radius: 10px;
    padding: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
  }
  .pb-btn:hover { background: #f7b84a; transform: translateY(-1px); }
  .pb-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .pb-success {
    text-align: center;
    padding: 20px 0;
  }
  .pb-success-icon { font-size: 48px; margin-bottom: 16px; }
  .pb-success-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 8px; color: #4caf7d; }
  .pb-success-detail { font-size: 14px; color: #6b6b78; line-height: 1.6; }

  .pb-error {
    background: #e05c5c1a;
    border: 1px solid #e05c5c44;
    border-radius: 10px;
    padding: 12px 16px;
    color: #e05c5c;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .pb-notfound {
    text-align: center;
    padding: 60px 20px;
  }
  .pb-notfound-icon { font-size: 48px; margin-bottom: 16px; }
  .pb-notfound-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 8px; }
  .pb-notfound-sub { font-size: 14px; color: #6b6b78; }

  .pb-loading { text-align: center; padding: 60px 20px; color: #6b6b78; font-size: 14px; }

  @media (max-width: 480px) {
    .pb-card { padding: 24px 20px; }
    .pb-slots { grid-template-columns: repeat(2, 1fr); }
  }
`

export default function PublicBooking() {
  const { slug } = useParams()
  const [pageData, setPageData] = useState(null)  // { biz_name, service, slots, booked_slots }
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)   // { slot, name }
  const [error, setError] = useState('')

  useEffect(() => { loadPage() }, [slug])

  const loadPage = async () => {
    setLoading(true)
    // Find the booking page by slug
    const { data: page } = await supabase
      .from('booking_pages')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!page) { setPageData(null); setLoading(false); return }

    // Load already-booked slots for this page
    const { data: bookings } = await supabase
      .from('bookings')
      .select('time_slot')
      .eq('booking_page_id', page.id)
      .eq('status', 'confirmed')

    const bookedSlots = new Set((bookings || []).map(b => b.time_slot))

    setPageData({ ...page, bookedSlots })
    setLoading(false)
  }

  const submit = async () => {
    if (!selected || !clientName.trim()) return
    setError('')
    setSubmitting(true)

    const { error: err } = await supabase.from('bookings').insert({
      user_id: pageData.user_id,
      booking_page_id: pageData.id,
      biz_name: pageData.biz_name,
      service: pageData.service,
      time_slot: selected,
      client_name: clientName.trim(),
      client_email: clientEmail.trim(),
      status: 'confirmed'
    })

    setSubmitting(false)

    if (err) {
      if (err.code === '23505') setError('That slot was just taken. Please choose another.')
      else setError('Something went wrong. Please try again.')
      loadPage()
    } else {
      setDone({ slot: selected, name: clientName.trim() })
    }
  }

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="pb-wrap">
        <div className="pb-logo">Biz<span>Kit</span></div>
        <div className="pb-loading">Loading booking page…</div>
      </div>
    </>
  )

  if (!pageData) return (
    <>
      <style>{styles}</style>
      <div className="pb-wrap">
        <div className="pb-logo">Biz<span>Kit</span></div>
        <div className="pb-card">
          <div className="pb-notfound">
            <div className="pb-notfound-icon">🔍</div>
            <div className="pb-notfound-title">Page not found</div>
            <div className="pb-notfound-sub">This booking link doesn't exist or has been removed.</div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{styles}</style>
      <div className="pb-wrap">
        <div className="pb-logo">Biz<span>Kit</span></div>
        <div className="pb-card">
          {done ? (
            <div className="pb-success">
              <div className="pb-success-icon">✅</div>
              <div className="pb-success-title">Booking Confirmed!</div>
              <div className="pb-success-detail">
                <strong style={{color:'#f0ede8'}}>{done.name}</strong>, you're booked for<br />
                <strong style={{color:'#f5a623'}}>{done.slot}</strong> with {pageData.biz_name}.<br /><br />
                {pageData.service && <span>Service: {pageData.service}<br /></span>}
                {clientEmail && <span>A confirmation will be sent to {clientEmail}.</span>}
              </div>
            </div>
          ) : (
            <>
              <div className="pb-biz">{pageData.biz_name}</div>
              <div className="pb-service">{pageData.service || 'Book a session'}</div>

              <div className="pb-section-label">Choose a time slot</div>
              <div className="pb-slots">
                {(pageData.slots || []).map((s, i) => (
                  <button
                    key={i}
                    className={`pb-slot ${pageData.bookedSlots?.has(s) ? 'booked' : ''} ${selected === s ? 'selected' : ''}`}
                    onClick={() => setSelected(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {selected && (
                <>
                  <div className="pb-divider" />
                  <div className="pb-section-label">Your details</div>

                  {error && <div className="pb-error">{error}</div>}

                  <div className="pb-field">
                    <label className="pb-label">Full Name *</label>
                    <input className="pb-input" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Jane Doe" />
                  </div>
                  <div className="pb-field">
                    <label className="pb-label">Email</label>
                    <input className="pb-input" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="jane@email.com" />
                  </div>

                  <button className="pb-btn" onClick={submit} disabled={submitting || !clientName.trim()}>
                    {submitting ? 'Confirming…' : `Confirm — ${selected}`}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
