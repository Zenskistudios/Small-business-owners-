import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";

const TABS = [
  { id: "invoice", label: "Invoice & Quote", icon: "📄" },
  { id: "booking", label: "Booking Page", icon: "📅" },
  { id: "ai", label: "AI Business Tools", icon: "🤖" },
  { id: "social", label: "Social Content", icon: "📣" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0c0c0f; }

  .toolkit { min-height: 100vh; background: #0c0c0f; color: #f0ede8; font-family: 'DM Sans', sans-serif; font-size: 15px; }

  .header { padding: 28px 40px 0; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #1e1e26; padding-bottom: 0; }
  .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: #f0ede8; letter-spacing: -0.5px; padding-bottom: 24px; flex-shrink: 0; }
  .logo span { color: #f5a623; }

  .header-right { display: flex; align-items: center; gap: 12px; margin-left: auto; padding-bottom: 24px; }
  .user-pill { background: #1e1e26; border-radius: 20px; padding: 6px 14px; font-size: 12px; color: #6b6b78; }
  .btn-signout { background: none; border: 1px solid #1e1e2699; color: #6b6b78; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .btn-signout:hover { border-color: #e05c5c; color: #e05c5c; }

  .tabs { display: flex; gap: 4px; }
  .tab { padding: 12px 20px; background: none; border: none; color: #6b6b78; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; }
  .tab:hover { color: #f0ede8; }
  .tab.active { color: #f5a623; border-bottom-color: #f5a623; }

  .content { padding: 40px; max-width: 900px; margin: 0 auto; }

  .section-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.5px; }
  .section-sub { color: #6b6b78; margin-bottom: 32px; font-size: 14px; }

  .card { background: #13131a; border: 1px solid #1e1e26; border-radius: 16px; padding: 28px; margin-bottom: 20px; }
  .card-title { font-family: 'Syne', sans-serif; font-weight: 600; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 0.8px; font-size: 12px; color: #6b6b78; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  label { display: block; font-size: 12px; font-weight: 500; color: #6b6b78; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }

  input, textarea, select { width: 100%; background: #0c0c0f; border: 1px solid #1e1e26; border-radius: 10px; padding: 12px 14px; color: #f0ede8; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
  input:focus, textarea:focus, select:focus { border-color: #f5a623; }
  textarea { resize: vertical; min-height: 80px; }

  .btn { padding: 12px 24px; border-radius: 10px; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .btn-primary { background: #f5a623; color: #0c0c0f; font-weight: 700; }
  .btn-primary:hover { background: #f7b84a; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-ghost { background: #1e1e26; color: #f0ede8; }
  .btn-ghost:hover { background: #2a2a35; }
  .btn-danger { background: none; color: #e05c5c; border: 1px solid #e05c5c33; font-size: 12px; padding: 6px 12px; }

  .line-items { margin-bottom: 16px; }
  .line-item { display: grid; grid-template-columns: 3fr 1fr 1fr auto; gap: 10px; align-items: end; margin-bottom: 10px; }

  .total-bar { background: #0c0c0f; border: 1px solid #f5a623; border-radius: 12px; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
  .total-label { font-size: 13px; color: #6b6b78; }
  .total-amount { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #f5a623; }

  .saved-list { margin-bottom: 20px; }
  .saved-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #0c0c0f; border: 1px solid #1e1e26; border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: border-color 0.2s; }
  .saved-item:hover { border-color: #f5a623; }
  .saved-item-name { font-weight: 600; color: #f0ede8; font-size: 13px; }
  .saved-item-meta { color: #6b6b78; font-size: 12px; margin-top: 2px; }
  .saved-item-amount { font-family: 'Syne', sans-serif; font-weight: 700; color: #f5a623; font-size: 15px; }

  .time-slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px; }
  .time-slot { padding: 10px; background: #0c0c0f; border: 1px solid #1e1e26; border-radius: 10px; text-align: center; font-size: 13px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; gap: 4px; }
  .time-slot.booked { opacity: 0.35; pointer-events: none; text-decoration: line-through; }
  .time-slot:not(.booked):hover { border-color: #f5a623; color: #f5a623; }
  .time-slot.selected { border-color: #f5a623; background: #f5a6231a; color: #f5a623; }
  .del-slot { background: none; border: none; cursor: pointer; color: #e05c5c; font-size: 14px; padding: 0; line-height: 1; }

  .share-box { background: #0c0c0f; border: 1px dashed #1e1e26; border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; }
  .share-url { font-size: 13px; color: #6b6b78; font-family: monospace; word-break: break-all; }

  .ai-tools-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
  .ai-tool-btn { padding: 18px; background: #13131a; border: 1px solid #1e1e26; border-radius: 12px; cursor: pointer; text-align: left; transition: all 0.2s; color: #f0ede8; font-family: 'DM Sans', sans-serif; }
  .ai-tool-btn:hover { border-color: #f5a623; background: #f5a6230d; }
  .ai-tool-btn.active { border-color: #f5a623; background: #f5a6231a; }
  .ai-tool-icon { font-size: 22px; margin-bottom: 8px; display: block; }
  .ai-tool-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
  .ai-tool-desc { font-size: 12px; color: #6b6b78; line-height: 1.4; }

  .ai-output { background: #0c0c0f; border: 1px solid #1e1e26; border-radius: 12px; padding: 20px; white-space: pre-wrap; font-size: 14px; line-height: 1.7; color: #d0cdc8; min-height: 120px; }
  .ai-output.loading { color: #6b6b78; font-style: italic; }
  .typing-dots::after { content: ''; animation: dots 1.2s infinite; }
  @keyframes dots { 0%,20%{content:''} 40%{content:'.'} 60%{content:'..'} 80%,100%{content:'...'} }

  .social-platforms { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
  .platform-btn { padding: 8px 16px; border-radius: 20px; border: 1px solid #1e1e26; background: #13131a; color: #6b6b78; cursor: pointer; font-size: 13px; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .platform-btn.active { border-color: #f5a623; color: #f5a623; background: #f5a6231a; }

  .content-cards { display: grid; grid-template-columns: 1fr; gap: 14px; margin-top: 20px; }
  .content-card { background: #0c0c0f; border: 1px solid #1e1e26; border-radius: 12px; padding: 18px; }
  .content-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .platform-tag { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #f5a623; background: #f5a6231a; padding: 4px 10px; border-radius: 20px; }
  .copy-btn { background: none; border: 1px solid #1e1e26; color: #6b6b78; padding: 4px 12px; border-radius: 8px; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .copy-btn:hover { border-color: #f5a623; color: #f5a623; }
  .content-text { font-size: 14px; line-height: 1.7; color: #d0cdc8; white-space: pre-wrap; }
  .tag { display: inline-block; background: #1e1e26; color: #6b6b78; border-radius: 6px; padding: 3px 10px; font-size: 12px; margin: 3px; }

  .flex-end { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  .divider { height: 1px; background: #1e1e26; margin: 20px 0; }

  .invoice-preview { background: #f9f7f4; color: #1a1a1a; border-radius: 12px; padding: 32px; font-family: 'DM Sans', sans-serif; }
  .inv-header { display: flex; justify-content: space-between; margin-bottom: 32px; }
  .inv-biz { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; }
  .inv-badge { background: #f5a623; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; align-self: flex-start; }
  .inv-to { margin-bottom: 24px; }
  .inv-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .inv-val { font-size: 14px; font-weight: 500; }
  .inv-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .inv-table th { text-align: left; font-size: 11px; text-transform: uppercase; color: #888; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
  .inv-table td { padding: 10px 0; border-bottom: 1px solid #f0ede8; font-size: 13px; }
  .inv-total { text-align: right; font-size: 18px; font-weight: 700; color: #f5a623; }

  .success-toast { position: fixed; bottom: 30px; right: 30px; background: #1e1e26; border: 1px solid #f5a623; border-radius: 12px; padding: 14px 20px; font-size: 14px; color: #f0ede8; z-index: 1000; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }

  .badge { display: inline-block; background: #f5a6231a; color: #f5a623; border: 1px solid #f5a62333; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 600; margin-left: 8px; vertical-align: middle; }

  .db-status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #6b6b78; margin-bottom: 20px; }
  .db-dot { width: 7px; height: 7px; border-radius: 50%; background: #4caf7d; flex-shrink: 0; }
  .db-dot.saving { background: #f5a623; animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  @media (max-width: 640px) {
    .header { flex-direction: column; align-items: flex-start; padding: 20px; }
    .header-right { padding-bottom: 0; margin-left: 0; }
    .tabs { overflow-x: auto; width: 100%; }
    .content { padding: 20px; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .ai-tools-grid { grid-template-columns: 1fr; }
    .line-item { grid-template-columns: 1fr; }
    .time-slots { grid-template-columns: repeat(3, 1fr); }
  }
`;

// ─── INVOICE TAB ────────────────────────────────────────────────
function InvoiceTab({ user }) {
  const [biz, setBiz] = useState({ name: "", address: "", email: "" });
  const [client, setClient] = useState({ name: "", email: "", address: "" });
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([{ desc: "", qty: 1, price: "" }]);
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  useEffect(() => { loadInvoices(); }, []);

  const loadInvoices = async () => {
    const { data } = await supabase
      .from('invoices').select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setSavedInvoices(data);
  };

  const saveInvoice = async () => {
    setSaving(true);
    const total = items.reduce((s, it) => s + (parseFloat(it.price)||0)*(parseInt(it.qty)||0), 0);
    const { error } = await supabase.from('invoices').upsert(
      { user_id: user.id, invoice_no: invoiceNo, biz, client, due_date: dueDate||null, items, note, total },
      { onConflict: 'user_id,invoice_no' }
    );
    setSaving(false);
    if (error) showToast('Error: ' + error.message);
    else { showToast('Invoice saved!'); loadInvoices(); }
  };

  const loadInvoice = (inv) => {
    setBiz(inv.biz); setClient(inv.client); setInvoiceNo(inv.invoice_no);
    setDueDate(inv.due_date || ''); setItems(inv.items); setNote(inv.note || '');
    setShowSaved(false); setPreview(false); showToast('Invoice loaded!');
  };

  const deleteInvoice = async (e, id) => {
    e.stopPropagation();
    await supabase.from('invoices').delete().eq('id', id);
    loadInvoices(); showToast('Deleted.');
  };

  const addItem = () => setItems([...items, { desc: "", qty: 1, price: "" }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, f, v) => { const u=[...items]; u[i][f]=v; setItems(u); };
  const total = items.reduce((s, it) => s + (parseFloat(it.price)||0)*(parseInt(it.qty)||0), 0);

  return (
    <div>
      <div className="section-title">Invoice & Quote Generator</div>
      <div className="section-sub">Create professional invoices. Saved to your account automatically.</div>

      <div className="db-status">
        <span className={`db-dot ${saving ? 'saving' : ''}`}></span>
        {saving ? 'Saving…' : `${savedInvoices.length} invoice${savedInvoices.length !== 1 ? 's' : ''} saved`}
        {savedInvoices.length > 0 && (
          <button onClick={() => setShowSaved(!showSaved)} style={{ marginLeft: 8, background: 'none', border: '1px solid #1e1e26', color: '#6b6b78', borderRadius: 6, padding: '2px 10px', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            {showSaved ? 'Hide' : 'Load saved'}
          </button>
        )}
      </div>

      {showSaved && (
        <div className="saved-list">
          {savedInvoices.map(inv => (
            <div key={inv.id} className="saved-item" onClick={() => loadInvoice(inv)}>
              <div>
                <div className="saved-item-name">{inv.invoice_no} — {inv.client?.name || 'No client'}</div>
                <div className="saved-item-meta">{inv.biz?.name} · {inv.due_date ? `Due ${inv.due_date}` : 'No due date'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="saved-item-amount">${Number(inv.total).toFixed(2)}</span>
                <button className="btn btn-danger" onClick={e => deleteInvoice(e, inv.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!preview ? (
        <>
          <div className="card">
            <div className="card-title">Your Business</div>
            <div className="grid-3">
              <div><label>Business Name</label><input value={biz.name} onChange={e=>setBiz({...biz,name:e.target.value})} placeholder="Acme Studio" /></div>
              <div><label>Email</label><input value={biz.email} onChange={e=>setBiz({...biz,email:e.target.value})} placeholder="hello@acme.com" /></div>
              <div><label>Address</label><input value={biz.address} onChange={e=>setBiz({...biz,address:e.target.value})} placeholder="123 Main St" /></div>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Client Details</div>
            <div className="grid-3">
              <div><label>Client Name</label><input value={client.name} onChange={e=>setClient({...client,name:e.target.value})} placeholder="Jane Doe" /></div>
              <div><label>Client Email</label><input value={client.email} onChange={e=>setClient({...client,email:e.target.value})} placeholder="jane@co.com" /></div>
              <div><label>Client Address</label><input value={client.address} onChange={e=>setClient({...client,address:e.target.value})} placeholder="456 Oak Ave" /></div>
            </div>
            <div className="divider" />
            <div className="grid-2">
              <div><label>Invoice Number</label><input value={invoiceNo} onChange={e=>setInvoiceNo(e.target.value)} /></div>
              <div><label>Due Date</label><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} /></div>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Line Items</div>
            <div className="line-items">
              {items.map((item, i) => (
                <div className="line-item" key={i}>
                  <div><label>Description</label><input value={item.desc} onChange={e=>updateItem(i,"desc",e.target.value)} placeholder="Web design service" /></div>
                  <div><label>Qty</label><input type="number" min="1" value={item.qty} onChange={e=>updateItem(i,"qty",e.target.value)} /></div>
                  <div><label>Unit Price ($)</label><input type="number" value={item.price} onChange={e=>updateItem(i,"price",e.target.value)} placeholder="0.00" /></div>
                  <div style={{paddingTop:22}}><button className="btn btn-danger" onClick={()=>removeItem(i)}>✕</button></div>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" onClick={addItem}>+ Add Item</button>
            <div className="total-bar">
              <div className="total-label">Total Amount</div>
              <div className="total-amount">${total.toFixed(2)}</div>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Notes / Terms</div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Payment due within 14 days. Thank you for your business!" />
          </div>
          <div className="flex-end">
            <button className="btn btn-ghost" onClick={saveInvoice} disabled={saving}>💾 Save</button>
            <button className="btn btn-primary" onClick={()=>setPreview(true)}>👁 Preview Invoice</button>
          </div>
        </>
      ) : (
        <>
          <div className="invoice-preview">
            <div className="inv-header">
              <div>
                <div className="inv-biz">{biz.name||"Your Business"}</div>
                <div style={{fontSize:13,color:"#666",marginTop:4}}>{biz.email}</div>
                <div style={{fontSize:13,color:"#666"}}>{biz.address}</div>
              </div>
              <div>
                <div className="inv-badge">INVOICE</div>
                <div style={{fontSize:13,color:"#666",marginTop:8,textAlign:"right"}}>{invoiceNo}</div>
                {dueDate && <div style={{fontSize:13,color:"#666",textAlign:"right"}}>Due: {dueDate}</div>}
              </div>
            </div>
            <div className="inv-to">
              <div className="inv-label">Bill To</div>
              <div className="inv-val">{client.name||"Client Name"}</div>
              <div style={{fontSize:13,color:"#666"}}>{client.email}</div>
              <div style={{fontSize:13,color:"#666"}}>{client.address}</div>
            </div>
            <table className="inv-table">
              <thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
              <tbody>
                {items.map((it,i) => (
                  <tr key={i}>
                    <td>{it.desc||"—"}</td><td>{it.qty}</td>
                    <td>${parseFloat(it.price||0).toFixed(2)}</td>
                    <td>${((parseFloat(it.price)||0)*(parseInt(it.qty)||0)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {note && <div style={{fontSize:13,color:"#888",marginBottom:16}}>{note}</div>}
            <div className="inv-total">Total: ${total.toFixed(2)}</div>
          </div>
          <div className="flex-end" style={{marginTop:20}}>
            <button className="btn btn-ghost" onClick={()=>setPreview(false)}>← Edit</button>
            <button className="btn btn-ghost" onClick={saveInvoice} disabled={saving}>💾 Save</button>
            <button className="btn btn-primary" onClick={()=>window.print()}>🖨 Print / PDF</button>
          </div>
        </>
      )}
      {toast && <div className="success-toast">✓ {toast}</div>}
    </div>
  );
}

// ─── BOOKING TAB ────────────────────────────────────────────────
function BookingTab({ user }) {
  const [bizName, setBizName] = useState("");
  const [service, setService] = useState("");
  const [slots, setSlots] = useState(["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM"]);
  const [newSlot, setNewSlot] = useState("");
  const [booked, setBooked] = useState({});
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [pageSlug, setPageSlug] = useState(null);
  const [pageId, setPageId] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => { loadExistingPage(); }, []);

  const loadExistingPage = async () => {
    // Load saved booking page for this user
    const { data: page } = await supabase
      .from('booking_pages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (page) {
      setBizName(page.biz_name || "");
      setService(page.service || "");
      setSlots(page.slots || ["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM"]);
      setPageSlug(page.slug);
      setPageId(page.id);
      loadBookings(page.id);
    }
  };

  const loadBookings = async (pid) => {
    const id = pid || pageId;
    if (!id) return;
    const { data } = await supabase.from('bookings').select('*')
      .eq('booking_page_id', id).order('created_at', { ascending: false });
    if (data) {
      setBookings(data);
      const b = {};
      data.forEach(bk => { b[bk.time_slot] = bk.client_name; });
      setBooked(b);
    }
  };

  const addSlot = () => { if (newSlot.trim()) { setSlots([...slots, newSlot.trim()]); setNewSlot(""); } };
  const removeSlot = (i) => setSlots(slots.filter((_, idx) => idx !== i));

  const publishPage = async () => {
    if (!bizName.trim()) { showToast("Please enter your business name first."); return; }
    setPublishing(true);
    const slug = bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const payload = {
      user_id: user.id,
      slug,
      biz_name: bizName,
      service,
      slots,
    };

    let savedId = pageId;

    if (pageId) {
      // Update existing page
      const { error } = await supabase.from('booking_pages').update(payload).eq('id', pageId);
      if (error) { showToast('Error: ' + error.message); setPublishing(false); return; }
    } else {
      // Create new page — handle slug collision by appending random suffix
      const finalSlug = slug + '-' + Math.random().toString(36).slice(2,6);
      payload.slug = finalSlug;
      const { data, error } = await supabase.from('booking_pages').insert(payload).select().single();
      if (error) { showToast('Error: ' + error.message); setPublishing(false); return; }
      savedId = data.id;
      setPageId(data.id);
      setPageSlug(data.slug);
    }

    setPublishing(false);
    showToast('Booking page published!');
    loadBookings(savedId);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/book/${pageSlug}`;
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard!");
  };

  const deleteBooking = async (id, slot) => {
    await supabase.from('bookings').delete().eq('id', id);
    const newBooked = { ...booked };
    delete newBooked[slot];
    setBooked(newBooked);
    loadBookings();
    showToast('Booking removed.');
  };

  const shareUrl = pageSlug ? `${window.location.origin}/book/${pageSlug}` : null;

  return (
    <div>
      <div className="section-title">Booking Page</div>
      <div className="section-sub">Publish your availability and share a real booking link with clients.</div>

      <div className="db-status">
        <span className={`db-dot ${publishing ? 'saving' : ''}`}></span>
        {publishing ? 'Publishing…' : pageSlug ? `Live at /book/${pageSlug}` : 'Not published yet'}
      </div>

      <div className="card">
        <div className="card-title">Setup</div>
        <div className="grid-2">
          <div><label>Business Name</label><input value={bizName} onChange={e=>setBizName(e.target.value)} placeholder="Acme Studio" /></div>
          <div><label>Service / Session Name</label><input value={service} onChange={e=>setService(e.target.value)} placeholder="1-hour Consultation" /></div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Available Time Slots</div>
        <div className="time-slots">
          {slots.map((s, i) => (
            <div key={i} className={`time-slot ${booked[s]?"booked":""}`}>
              <span>{s}</span>
              {!booked[s]
                ? <button className="del-slot" onClick={()=>removeSlot(i)}>✕</button>
                : <span style={{fontSize:10}}>✓ {booked[s]}</span>
              }
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,marginTop:16}}>
          <input value={newSlot} onChange={e=>setNewSlot(e.target.value)} placeholder="e.g. 5:00 PM" onKeyDown={e=>e.key==="Enter"&&addSlot()} style={{flex:1}} />
          <button className="btn btn-ghost" onClick={addSlot}>+ Add Slot</button>
        </div>
      </div>

      <div className="flex-end">
        <button className="btn btn-primary" onClick={publishPage} disabled={publishing}>
          {publishing ? 'Publishing…' : pageSlug ? '🔄 Update Page' : '🚀 Publish Booking Page'}
        </button>
      </div>

      {shareUrl && (
        <div className="share-box" style={{marginTop:20}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:'#6b6b78',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4}}>Your Booking Link</div>
            <div className="share-url">{shareUrl}</div>
          </div>
          <button className="btn btn-primary" onClick={copyLink}>Copy Link</button>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="card" style={{marginTop:20}}>
          <div className="card-title">Incoming Bookings ({bookings.length})</div>
          {bookings.map(b => (
            <div key={b.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #1e1e26'}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'#f0ede8'}}>{b.client_name} — {b.time_slot}</div>
                <div style={{fontSize:12,color:'#6b6b78'}}>{b.service} · {b.client_email || 'No email'}</div>
              </div>
              <button className="btn btn-danger" onClick={()=>deleteBooking(b.id, b.time_slot)}>✕</button>
            </div>
          ))}
        </div>
      )}

      {toast && <div className="success-toast">✓ {toast}</div>}
    </div>
  );
}

// ─── AI TOOLS TAB ────────────────────────────────────────────────
const AI_TOOLS = [
  { id: "proposal", icon: "📝", name: "Write a Proposal", desc: "Generate a professional project proposal for a client", prompt: (ctx) => `Write a short, professional business proposal for: ${ctx}. Include a brief intro, what you'll deliver, timeline, and a compelling closing.` },
  { id: "email", icon: "📧", name: "Customer Email Reply", desc: "Draft a polished reply to a customer message", prompt: (ctx) => `Write a professional, friendly reply to this customer message: "${ctx}". Keep it warm, clear, and concise.` },
  { id: "advice", icon: "💡", name: "Business Advice", desc: "Get quick actionable advice for your business challenge", prompt: (ctx) => `Give me 3–5 concise, actionable pieces of business advice for this situation: ${ctx}. Be direct and practical.` },
  { id: "pitch", icon: "🎯", name: "Elevator Pitch", desc: "Craft a 30-second pitch for your product or service", prompt: (ctx) => `Write a compelling 30-second elevator pitch for: ${ctx}. Make it memorable, clear, and end with a hook.` },
];

function AITab() {
  const [activeTool, setActiveTool] = useState(AI_TOOLS[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true); setOutput("");
    try {
      const res = await fetch("https://smallbiztoolkit.vercel.app/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-opus-4-5", max_tokens: 1000, messages: [{ role: "user", content: activeTool.prompt(input) }] })
      });
      const data = await res.json();
      if (!res.ok) {
        setOutput(`❌ Error ${res.status}: ${data.error || data.message || JSON.stringify(data)}`);
      } else if (data.content?.length) {
        setOutput(data.content.map(b => b.text||"").join(""));
      } else {
        setOutput("❌ Unexpected response: " + JSON.stringify(data));
      }
    } catch (e) { setOutput("❌ Network error: " + e.message); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(output); showToast("Copied!"); };

  return (
    <div>
      <div className="section-title">AI Business Tools <span className="badge">Powered by Claude</span></div>
      <div className="section-sub">Let AI do the heavy lifting — proposals, emails, advice, and more.</div>
      <div className="ai-tools-grid">
        {AI_TOOLS.map(t => (
          <button key={t.id} className={`ai-tool-btn ${activeTool.id===t.id?"active":""}`} onClick={()=>{setActiveTool(t);setInput("");setOutput("");}}>
            <span className="ai-tool-icon">{t.icon}</span>
            <div className="ai-tool-name">{t.name}</div>
            <div className="ai-tool-desc">{t.desc}</div>
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-title">{activeTool.name}</div>
        <label>Describe your situation or context</label>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={
          activeTool.id==="proposal"?"e.g. Build a Shopify store for a clothing brand, budget $2,000, 3 weeks":
          activeTool.id==="email"?"e.g. Hi, I'm unhappy with the delay on my order. It's been 2 weeks.":
          activeTool.id==="advice"?"e.g. My sales have dropped 30% this quarter and I don't know why.":
          "e.g. I offer logo design for small restaurants starting at $199"
        } rows={4} />
        <div className="flex-end">
          <button className="btn btn-primary" onClick={run} disabled={loading||!input.trim()}>
            {loading?"Generating...":"✨ Generate"}
          </button>
        </div>
      </div>
      {(output||loading) && (
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div className="card-title" style={{marginBottom:0}}>Result</div>
            {output && <button className="copy-btn" onClick={copy}>Copy</button>}
          </div>
          <div className={`ai-output ${loading?"loading":""}`}>
            {loading?<span className="typing-dots">Generating your content</span>:output}
          </div>
        </div>
      )}
      {toast && <div className="success-toast">✓ {toast}</div>}
    </div>
  );
}

// ─── SOCIAL CONTENT TAB ────────────────────────────────────────────────
const PLATFORMS = ["Instagram","Twitter/X","Facebook","LinkedIn","TikTok"];

function SocialTab({ user }) {
  const [platforms, setPlatforms] = useState(["Instagram","LinkedIn"]);
  const [bizType, setBizType] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [savedPosts, setSavedPosts] = useState([]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const togglePlatform = (p) => setPlatforms(prev => prev.includes(p)?prev.filter(x=>x!==p):[...prev,p]);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    const { data } = await supabase.from('social_posts').select('*')
      .eq('user_id', user.id).order('created_at', { ascending: false }).limit(20);
    if (data) setSavedPosts(data);
  };

  const generate = async () => {
    if (!topic.trim()||platforms.length===0) return;
    setLoading(true); setResults([]);
    const prompt = `You are a social media expert for small businesses.
Generate social media posts for: "${topic}"
Business type: ${bizType||"small business"}
Tone: ${tone}
Platforms: ${platforms.join(", ")}

Return ONLY valid JSON (no markdown, no preamble) in this format:
{"posts":[{"platform":"Instagram","content":"...","hashtags":["tag1","tag2","tag3"]}]}
One post per platform. Optimized for each platform's style and character limits.`;
    try {
      const res = await fetch("https://smallbiztoolkit.vercel.app/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-opus-4-5", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      if (!res.ok) {
        setResults([{ platform: "Error", content: `❌ Error ${res.status}: ${data.error || data.message || JSON.stringify(data)}`, hashtags: [] }]);
      } else {
        const text = data.content?.map(b=>b.text||"").join("")||"{}";
        const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
        setResults(parsed.posts||[]);
      }
    } catch (e) { setResults([{ platform: "Error", content: "❌ Network error: " + e.message, hashtags: [] }]); }
    setLoading(false);
  };

  const savePost = async (post) => {
    const { error } = await supabase.from('social_posts').insert({
      user_id: user.id, platform: post.platform,
      content: post.content, hashtags: post.hashtags, topic, biz_type: bizType, tone
    });
    if (error) showToast('Error: ' + error.message);
    else { showToast('Post saved!'); loadPosts(); }
  };

  const deletePost = async (id) => {
    await supabase.from('social_posts').delete().eq('id', id);
    loadPosts(); showToast('Post deleted.');
  };

  const copy = (text, tags) => {
    navigator.clipboard.writeText(text+"\n\n"+(tags||[]).map(t=>`#${t}`).join(" "));
    showToast("Copied!");
  };

  return (
    <div>
      <div className="section-title">Social Media Content Creator <span className="badge">AI-Powered</span></div>
      <div className="section-sub">Generate platform-optimized posts and save your favourites.</div>

      <div className="card">
        <div className="card-title">Platforms</div>
        <div className="social-platforms">
          {PLATFORMS.map(p => (
            <button key={p} className={`platform-btn ${platforms.includes(p)?"active":""}`} onClick={()=>togglePlatform(p)}>{p}</button>
          ))}
        </div>
        <div className="grid-2">
          <div><label>Business Type</label><input value={bizType} onChange={e=>setBizType(e.target.value)} placeholder="e.g. Hair salon, bakery, gym..." /></div>
          <div>
            <label>Tone</label>
            <select value={tone} onChange={e=>setTone(e.target.value)}>
              <option value="professional">Professional</option>
              <option value="casual and fun">Casual & Fun</option>
              <option value="inspirational">Inspirational</option>
              <option value="promotional">Promotional</option>
              <option value="educational">Educational</option>
            </select>
          </div>
        </div>
        <div style={{marginTop:16}}>
          <label>What do you want to post about?</label>
          <textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. New summer menu launch with 20% off this week" rows={3} />
        </div>
        <div className="flex-end">
          <button className="btn btn-primary" onClick={generate} disabled={loading||!topic.trim()||platforms.length===0}>
            {loading?"Generating...":"✨ Create Posts"}
          </button>
        </div>
      </div>

      {loading && <div className="card"><div className="ai-output loading"><span className="typing-dots">Creating your posts</span></div></div>}

      {results.length > 0 && (
        <div className="content-cards">
          {results.map((r, i) => (
            <div className="content-card" key={i}>
              <div className="content-card-header">
                <span className="platform-tag">{r.platform}</span>
                <div style={{display:'flex',gap:8}}>
                  <button className="copy-btn" onClick={()=>savePost(r)}>💾 Save</button>
                  <button className="copy-btn" onClick={()=>copy(r.content,r.hashtags)}>Copy</button>
                </div>
              </div>
              <div className="content-text">{r.content}</div>
              {r.hashtags?.length>0 && <div style={{marginTop:12}}>{r.hashtags.map((h,j)=><span key={j} className="tag">#{h}</span>)}</div>}
            </div>
          ))}
        </div>
      )}

      {savedPosts.length > 0 && (
        <div style={{marginTop:32}}>
          <div className="card-title" style={{marginBottom:14}}>Saved Posts ({savedPosts.length})</div>
          <div className="content-cards">
            {savedPosts.map(p => (
              <div className="content-card" key={p.id}>
                <div className="content-card-header">
                  <span className="platform-tag">{p.platform}</span>
                  <div style={{display:'flex',gap:8}}>
                    <button className="copy-btn" onClick={()=>copy(p.content,p.hashtags||[])}>Copy</button>
                    <button className="copy-btn" style={{color:'#e05c5c',borderColor:'#e05c5c33'}} onClick={()=>deletePost(p.id)}>✕</button>
                  </div>
                </div>
                <div className="content-text">{p.content}</div>
                {p.hashtags?.length>0 && <div style={{marginTop:12}}>{p.hashtags.map((h,j)=><span key={j} className="tag">#{h}</span>)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && <div className="success-toast">✓ {toast}</div>}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("invoice");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); setUser(null); };

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0c0c0f',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'DM Sans',sans-serif",color:'#6b6b78',fontSize:14}}>
      Loading…
    </div>
  );

  if (!user) return <Auth onAuth={setUser} />;

  return (
    <>
      <style>{styles}</style>
      <div className="toolkit">
        <div className="header">
          <div className="logo">Biz<span>Kit</span></div>
          <div className="tabs">
            {TABS.map(t => (
              <button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className="header-right">
            <span className="user-pill">{user.email}</span>
            <button className="btn-signout" onClick={signOut}>Sign out</button>
          </div>
        </div>
        <div className="content">
          {tab==="invoice" && <InvoiceTab user={user} />}
          {tab==="booking" && <BookingTab user={user} />}
          {tab==="ai"      && <AITab />}
          {tab==="social"  && <SocialTab user={user} />}
        </div>
      </div>
    </>
  );
}
