import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Clock, Target, Users, Globe } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Vetted Professionals",
    description: "Every executive undergoes rigorous screening including background checks, reference verification, and skill assessments.",
    badge: "Premium"
  },
  {
    icon: Clock,
    title: "Rapid Deployment",
    description: "Access top talent within 48 hours. Our streamlined process ensures quick matching and onboarding.",
    badge: "Fast"
  },
  {
    icon: Target,
    title: "Precision Matching",
    description: "AI-powered matching algorithm considers industry expertise, company culture, and project requirements.",
    badge: "Smart"
  },
  {
    icon: Users,
    title: "Proven Track Record",
    description: "Access executives with documented success in Fortune 500 companies and industry-leading organizations.",
    badge: "Trusted"
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Worldwide talent pool spanning all major markets and time zones for seamless collaboration.",
    badge: "Global"
  },
  {
    icon: CheckCircle,
    title: "Quality Guarantee",
    description: "100% satisfaction guarantee with ongoing support and performance monitoring throughout engagement.",
    badge: "Guaranteed"
  }
]

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Why Choose GigExecs
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Executive Talent Platform
            <span className="text-gradient block">Built for Results</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've reimagined how companies connect with executive talent, combining cutting-edge technology 
            with deep industry expertise to deliver exceptional outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-elegant group hover:scale-105 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-primary p-3 rounded-lg">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features