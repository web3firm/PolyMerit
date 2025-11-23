export default function ContactPage() {
    return (
        <div className="container section" style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Contact Us</h1>
            <p style={{ textAlign: 'center', color: 'var(--color-text-dim)', marginBottom: '3rem' }}>
                Have questions or suggestions? We'd love to hear from you.
            </p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="email" style={{ fontWeight: '500' }}>Email Address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-card-bg)',
                            color: 'var(--color-text)',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="subject" style={{ fontWeight: '500' }}>Subject</label>
                    <select
                        id="subject"
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-card-bg)',
                            color: 'var(--color-text)',
                            fontFamily: 'inherit'
                        }}
                    >
                        <option>General Inquiry</option>
                        <option>Bug Report</option>
                        <option>Feature Request</option>
                        <option>Partnership</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="message" style={{ fontWeight: '500' }}>Message</label>
                    <textarea
                        id="message"
                        rows={5}
                        placeholder="How can we help you?"
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-card-bg)',
                            color: 'var(--color-text)',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Send Message
                </button>
            </form>
        </div>
    );
}
