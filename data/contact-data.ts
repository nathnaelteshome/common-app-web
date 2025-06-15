export interface ContactInfo {
  address: string
  phone: string
  email: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export const contactInfo: ContactInfo = {
  address: "Addis Ababa, Ethiopia",
  phone: "+251 911221122",
  email: "commonapply@gmail.com",
  coordinates: {
    lat: 9.0192,
    lng: 38.7525,
  },
}

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "What are the office hours for student inquiries?",
    answer:
      "Our office is open Monday through Friday from 8:00 AM to 5:00 PM (Ethiopian Time). We also offer extended hours during peak application periods.",
    category: "General",
  },
  {
    id: "2",
    question: "How long does it take to receive a response to my inquiry?",
    answer:
      "We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please call our phone number directly.",
    category: "General",
  },
  {
    id: "3",
    question: "Can I schedule an in-person appointment?",
    answer:
      "Yes, we offer in-person consultations by appointment. Please use the contact form or call us to schedule a meeting with our admissions team.",
    category: "Appointments",
  },
  {
    id: "4",
    question: "What information should I include when contacting about applications?",
    answer:
      "Please include your full name, student ID (if applicable), the program you're interested in, and specific questions about the application process.",
    category: "Applications",
  },
  {
    id: "5",
    question: "Do you provide support in languages other than English?",
    answer:
      "Yes, we provide support in Amharic, Oromo, and Tigrinya. Please specify your preferred language when contacting us.",
    category: "General",
  },
  {
    id: "6",
    question: "How can I get technical support for the application portal?",
    answer:
      "For technical issues with our online application system, please email us with details about the problem, including screenshots if possible.",
    category: "Technical",
  },
  {
    id: "7",
    question: "Can parents or guardians contact on behalf of students?",
    answer:
      "Yes, parents and guardians can contact us regarding their children's applications. However, some information may require student consent to share.",
    category: "General",
  },
  {
    id: "8",
    question: "What is the best way to submit documents?",
    answer:
      "Documents can be submitted through our online portal, emailed as PDF attachments, or delivered in person during office hours.",
    category: "Applications",
  },
]

export function getFAQsByCategory(category?: string): FAQ[] {
  if (!category) return faqs
  return faqs.filter((faq) => faq.category === category)
}

export function getFAQCategories(): string[] {
  return Array.from(new Set(faqs.map((faq) => faq.category)))
}
