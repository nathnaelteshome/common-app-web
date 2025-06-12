import type { NotificationTemplate } from "@/lib/validations/system-admin"

export interface NotificationChannel {
  type: "email" | "sms" | "push" | "in_app"
  config: Record<string, any>
  isEnabled: boolean
  priority: number
}

export interface NotificationDelivery {
  id: string
  templateId: string
  recipientId: string
  recipientEmail?: string
  recipientPhone?: string
  channel: string
  status: "pending" | "sent" | "delivered" | "failed" | "bounced"
  sentAt?: string
  deliveredAt?: string
  failureReason?: string
  retryCount: number
  metadata: Record<string, any>
}

export interface NotificationAnalytics {
  totalSent: number
  deliveryRate: number
  openRate: number
  clickRate: number
  bounceRate: number
  channelPerformance: Array<{
    channel: string
    sent: number
    delivered: number
    opened: number
    clicked: number
  }>
  templatePerformance: Array<{
    templateId: string
    templateName: string
    sent: number
    delivered: number
    opened: number
    clicked: number
  }>
}

export class NotificationService {
  private channels: Map<string, NotificationChannel> = new Map()
  private templates: Map<string, NotificationTemplate> = new Map()
  private deliveries: Map<string, NotificationDelivery> = new Map()
  private queue: Array<{
    id: string
    templateId: string
    recipientId: string
    data: Record<string, any>
    scheduledFor?: string
    priority: number
  }> = []

  constructor() {
    this.initializeChannels()
  }

  private initializeChannels() {
    // Email channel
    this.channels.set("email", {
      type: "email",
      config: {
        provider: "sendgrid",
        apiKey: "sg_example_key",
        fromEmail: "noreply@commonapply.com",
        fromName: "CommonApply",
      },
      isEnabled: true,
      priority: 1,
    })

    // SMS channel
    this.channels.set("sms", {
      type: "sms",
      config: {
        provider: "twilio",
        accountSid: "AC_example",
        authToken: "auth_example",
        fromNumber: "+1234567890",
      },
      isEnabled: true,
      priority: 2,
    })

    // Push notification channel
    this.channels.set("push", {
      type: "push",
      config: {
        provider: "firebase",
        serverKey: "firebase_server_key",
      },
      isEnabled: true,
      priority: 3,
    })

    // In-app notification channel
    this.channels.set("in_app", {
      type: "in_app",
      config: {},
      isEnabled: true,
      priority: 4,
    })
  }

  async createTemplate(template: Omit<NotificationTemplate, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const templateId = `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newTemplate: NotificationTemplate = {
      ...template,
      id: templateId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
    }

    this.templates.set(templateId, newTemplate)
    return templateId
  }

  async updateTemplate(templateId: string, updates: Partial<NotificationTemplate>): Promise<void> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error("Template not found")
    }

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.templates.set(templateId, updatedTemplate)
  }

  async sendNotification(
    templateId: string,
    recipientId: string,
    data: Record<string, any>,
    options: {
      channels?: string[]
      priority?: number
      scheduledFor?: string
    } = {},
  ): Promise<string[]> {
    const template = this.templates.get(templateId)
    if (!template || !template.isActive) {
      throw new Error("Template not found or inactive")
    }

    const channels = options.channels || [template.type]
    const deliveryIds: string[] = []

    for (const channelType of channels) {
      const channel = this.channels.get(channelType)
      if (!channel || !channel.isEnabled) {
        continue
      }

      const deliveryId = await this.queueNotification(templateId, recipientId, channelType, data, options)
      deliveryIds.push(deliveryId)
    }

    // Update template usage count
    template.usageCount = (template.usageCount || 0) + 1
    this.templates.set(templateId, template)

    return deliveryIds
  }

  private async queueNotification(
    templateId: string,
    recipientId: string,
    channelType: string,
    data: Record<string, any>,
    options: any,
  ): Promise<string> {
    const deliveryId = `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const delivery: NotificationDelivery = {
      id: deliveryId,
      templateId,
      recipientId,
      channel: channelType,
      status: "pending",
      retryCount: 0,
      metadata: data,
    }

    this.deliveries.set(deliveryId, delivery)

    // Add to queue for processing
    this.queue.push({
      id: deliveryId,
      templateId,
      recipientId,
      data,
      scheduledFor: options.scheduledFor,
      priority: options.priority || 5,
    })

    // Process queue (in real app, this would be handled by a background worker)
    setTimeout(() => this.processQueue(), 1000)

    return deliveryId
  }

  private async processQueue() {
    // Sort by priority and scheduled time
    this.queue.sort((a, b) => {
      if (a.scheduledFor && b.scheduledFor) {
        return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
      }
      return a.priority - b.priority
    })

    const now = new Date()
    const readyToSend = this.queue.filter((item) => !item.scheduledFor || new Date(item.scheduledFor) <= now)

    for (const item of readyToSend.slice(0, 10)) {
      // Process 10 at a time
      await this.deliverNotification(item.id)
      this.queue = this.queue.filter((q) => q.id !== item.id)
    }
  }

  private async deliverNotification(deliveryId: string): Promise<void> {
    const delivery = this.deliveries.get(deliveryId)
    if (!delivery) return

    const template = this.templates.get(delivery.templateId)
    if (!template) return

    const channel = this.channels.get(delivery.channel)
    if (!channel) return

    try {
      // Render template with data
      const renderedContent = this.renderTemplate(template, delivery.metadata)

      // Simulate delivery based on channel type
      const success = await this.simulateDelivery(channel.type, renderedContent, delivery)

      if (success) {
        delivery.status = "delivered"
        delivery.deliveredAt = new Date().toISOString()
      } else {
        delivery.status = "failed"
        delivery.failureReason = "Delivery failed"
        delivery.retryCount++
      }

      delivery.sentAt = new Date().toISOString()
      this.deliveries.set(deliveryId, delivery)
    } catch (error) {
      delivery.status = "failed"
      delivery.failureReason = error instanceof Error ? error.message : "Unknown error"
      delivery.retryCount++
      this.deliveries.set(deliveryId, delivery)
    }
  }

  private renderTemplate(
    template: NotificationTemplate,
    data: Record<string, any>,
  ): {
    subject: string
    content: string
  } {
    let subject = template.subject
    let content = template.content

    // Replace variables in template
    template.variables.forEach((variable) => {
      const value = data[variable] || `{{${variable}}}`
      const regex = new RegExp(`{{${variable}}}`, "g")
      subject = subject.replace(regex, value)
      content = content.replace(regex, value)
    })

    return { subject, content }
  }

  private async simulateDelivery(
    channelType: string,
    content: { subject: string; content: string },
    delivery: NotificationDelivery,
  ): Promise<boolean> {
    // Simulate different delivery success rates by channel
    const successRates = {
      email: 0.95,
      sms: 0.98,
      push: 0.9,
      in_app: 0.99,
    }

    const successRate = successRates[channelType as keyof typeof successRates] || 0.95
    const success = Math.random() < successRate

    // Simulate delivery delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

    console.log(`${channelType.toUpperCase()} notification ${success ? "delivered" : "failed"}:`, {
      deliveryId: delivery.id,
      subject: content.subject,
      content: content.content.substring(0, 100) + "...",
    })

    return success
  }

  async getDeliveryStatus(deliveryId: string): Promise<NotificationDelivery | null> {
    return this.deliveries.get(deliveryId) || null
  }

  async getTemplateAnalytics(templateId: string): Promise<{
    totalSent: number
    deliveryRate: number
    failureReasons: Array<{ reason: string; count: number }>
  }> {
    const deliveries = Array.from(this.deliveries.values()).filter((d) => d.templateId === templateId)

    const totalSent = deliveries.length
    const delivered = deliveries.filter((d) => d.status === "delivered").length
    const deliveryRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0

    const failureReasons = new Map<string, number>()
    deliveries
      .filter((d) => d.status === "failed")
      .forEach((d) => {
        const reason = d.failureReason || "Unknown"
        failureReasons.set(reason, (failureReasons.get(reason) || 0) + 1)
      })

    return {
      totalSent,
      deliveryRate,
      failureReasons: Array.from(failureReasons.entries()).map(([reason, count]) => ({ reason, count })),
    }
  }

  async getNotificationAnalytics(): Promise<NotificationAnalytics> {
    const deliveries = Array.from(this.deliveries.values())

    const totalSent = deliveries.length
    const delivered = deliveries.filter((d) => d.status === "delivered").length
    const deliveryRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0

    // Simulate open and click rates
    const opened = Math.floor(delivered * 0.25) // 25% open rate
    const clicked = Math.floor(opened * 0.15) // 15% click rate
    const bounced = deliveries.filter((d) => d.status === "bounced").length

    const openRate = delivered > 0 ? (opened / delivered) * 100 : 0
    const clickRate = opened > 0 ? (clicked / opened) * 100 : 0
    const bounceRate = totalSent > 0 ? (bounced / totalSent) * 100 : 0

    // Channel performance
    const channelStats = new Map<string, any>()
    deliveries.forEach((d) => {
      if (!channelStats.has(d.channel)) {
        channelStats.set(d.channel, { sent: 0, delivered: 0, opened: 0, clicked: 0 })
      }
      const stats = channelStats.get(d.channel)
      stats.sent++
      if (d.status === "delivered") stats.delivered++
    })

    const channelPerformance = Array.from(channelStats.entries()).map(([channel, stats]) => ({
      channel,
      ...stats,
    }))

    // Template performance
    const templateStats = new Map<string, any>()
    deliveries.forEach((d) => {
      if (!templateStats.has(d.templateId)) {
        const template = this.templates.get(d.templateId)
        templateStats.set(d.templateId, {
          templateName: template?.name || "Unknown",
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
        })
      }
      const stats = templateStats.get(d.templateId)
      stats.sent++
      if (d.status === "delivered") stats.delivered++
    })

    const templatePerformance = Array.from(templateStats.entries()).map(([templateId, stats]) => ({
      templateId,
      ...stats,
    }))

    return {
      totalSent,
      deliveryRate,
      openRate,
      clickRate,
      bounceRate,
      channelPerformance,
      templatePerformance,
    }
  }

  getTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values())
  }

  async testTemplate(
    templateId: string,
    testData: Record<string, any>,
  ): Promise<{
    subject: string
    content: string
    preview: string
  }> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error("Template not found")
    }

    const rendered = this.renderTemplate(template, testData)

    return {
      ...rendered,
      preview: rendered.content.substring(0, 200) + "...",
    }
  }
}

export const notificationService = new NotificationService()
