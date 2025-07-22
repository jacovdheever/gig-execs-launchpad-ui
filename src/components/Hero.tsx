import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Users, TrendingUp } from "lucide-react"
import heroImage from "@/assets/hero-executive.jpg"

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <Badge variant="outline" className="w-fit">
              <Star className="h-3 w-3 mr-2 text-primary" />
              Trusted by Fortune 500 Companies
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Connect with
                <span className="text-gradient block">Top Executive Talent</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Access a curated network of experienced executives for your most critical projects. 
                From strategy to transformation, find the expertise that drives results.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl">
                Find Executives
              </Button>
              <Button variant="outline" size="xl">
                Join as Executive
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">500+</div>
                  <div className="text-sm text-muted-foreground">Executives</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="card-elegant p-8 bg-gradient-hero">
              <img 
                src={heroImage}
                alt="Executive professional"
                className="w-full h-auto rounded-lg shadow-soft"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 card-elegant p-4 bg-card max-w-48">
              <div className="text-sm font-medium">Latest Project</div>
              <div className="text-xs text-muted-foreground">Digital Transformation</div>
              <div className="text-lg font-bold text-primary mt-1">$2.5M Value</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero