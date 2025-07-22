import { Briefcase, Twitter, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">GigExecs</span>
            </div>
            <p className="text-muted-foreground">
              Connecting businesses with top executive talent for transformational results.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* For Companies */}
          <div className="space-y-4">
            <h4 className="font-semibold">For Companies</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Find Executives</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Post a Project</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Enterprise Solutions</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* For Executives */}
          <div className="space-y-4">
            <h4 className="font-semibold">For Executives</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Join Network</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Browse Projects</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Resources</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 GigExecs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer