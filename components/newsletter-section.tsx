import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSection() {
  return (
    <section className="bg-primary py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4 font-sora">Join Our Newsletter</h2>
        <p className="text-blue-100 mb-8 max-w-md mx-auto">Subscribe our newsletter to get our latest update & news.</p>

        <div className="max-w-md mx-auto flex gap-2">
          <Input type="email" placeholder="Enter your email:" className="bg-white border-0 flex-1" />
          <Button className="bg-primary hover:bg-primary/90 text-white px-6">Subscribe Now</Button>
        </div>
      </div>
    </section>
  )
}
