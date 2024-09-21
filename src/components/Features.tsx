import { Zap, Wifi, Cpu } from 'lucide-react'

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Zap className="h-12 w-12 mb-4 text-primary" />}
            title="Fast Flashing"
            description="Flash your Bitaxe in seconds, not minutes."
          />
          <FeatureCard
            icon={<Wifi className="h-12 w-12 mb-4 text-primary" />}
            title="Web-Based"
            description="No need for special software. Use your web browser."
          />
          <FeatureCard
            icon={<Cpu className="h-12 w-12 mb-4 text-primary" />}
            title="Multiple Boards"
            description="Support for various Bitaxe boards and modules."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      {icon}
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}