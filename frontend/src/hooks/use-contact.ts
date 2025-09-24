import { useCallback } from 'react'

interface ContactInfo {
  name: string
  email: string
  phone?: string
  message?: string
}

export function useContact() {
  const contactOwner = useCallback(async (ownerId: string, propertyName: string) => {
    // For now, we'll simulate contact functionality
    // In a real app, this would send an email or open a contact form
    
    const contactData = {
      ownerId,
      propertyName,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }

    try {
      // Simulate API call
      console.log('Contact request:', contactData)
      
      // Show success message
      alert(`Contact request sent for property: ${propertyName}\nOwner ID: ${ownerId}`)
      
      // In a real implementation, you might:
      // 1. Open a contact form modal
      // 2. Send an email via API
      // 3. Create a contact request in the database
      // 4. Send notification to property owner
      
      return { success: true, message: 'Contact request sent successfully' }
    } catch (error) {
      console.error('Error sending contact request:', error)
      alert('Failed to send contact request. Please try again.')
      return { success: false, message: 'Failed to send contact request' }
    }
  }, [])

  const openContactForm = useCallback((ownerId: string, propertyName: string) => {
    // Create a simple contact form
    const form = document.createElement('form')
    form.innerHTML = `
      <div style="padding: 20px; max-width: 400px;">
        <h3>Contact Property Owner</h3>
        <p><strong>Property:</strong> ${propertyName}</p>
        <p><strong>Owner ID:</strong> ${ownerId}</p>
        <br>
        <label>Your Name:</label><br>
        <input type="text" name="name" required style="width: 100%; padding: 8px; margin: 5px 0;"><br>
        <label>Your Email:</label><br>
        <input type="email" name="email" required style="width: 100%; padding: 8px; margin: 5px 0;"><br>
        <label>Your Phone (optional):</label><br>
        <input type="tel" name="phone" style="width: 100%; padding: 8px; margin: 5px 0;"><br>
        <label>Message:</label><br>
        <textarea name="message" rows="4" style="width: 100%; padding: 8px; margin: 5px 0;"></textarea><br>
        <button type="submit" style="background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Send Message</button>
        <button type="button" onclick="this.parentElement.parentElement.remove()" style="background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Cancel</button>
      </div>
    `
    
    form.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10000;
    `
    
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    `
    
    overlay.onclick = () => {
      document.body.removeChild(overlay)
      document.body.removeChild(form)
    }
    
    form.onsubmit = (e) => {
      e.preventDefault()
      const formData = new FormData(form)
      const contactInfo: ContactInfo = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || undefined,
        message: formData.get('message') as string || undefined
      }
      
      console.log('Contact form submitted:', { ownerId, propertyName, ...contactInfo })
      alert('Message sent successfully!')
      
      document.body.removeChild(overlay)
      document.body.removeChild(form)
    }
    
    document.body.appendChild(overlay)
    document.body.appendChild(form)
  }, [])

  return {
    contactOwner,
    openContactForm
  }
}
