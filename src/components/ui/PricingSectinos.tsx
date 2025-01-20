import { Check, X } from 'lucide-react';

const PricingSection = () => {
  const tiers = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for individuals and small teams getting started",
      features: [
        { name: "Up to 5 team members", included: true },
        { name: "Basic task management", included: true },
        { name: "2 projects", included: true },
        { name: "Basic analytics", included: true },
        { name: "24/7 support", included: false },
        { name: "Custom workflows", included: false },
        { name: "Advanced security", included: false },
        { name: "API access", included: false }
      ],
      buttonText: "Get Started",
      isPopular: false
    },
    {
      name: "Pro Monthly",
      price: "₹999",
      period: "per month",
      description: "Ideal for growing teams and organizations",
      features: [
        { name: "Up to 50 team members", included: true },
        { name: "Advanced task management", included: true },
        { name: "Unlimited projects", included: true },
        { name: "Advanced analytics", included: true },
        { name: "24/7 priority support", included: true },
        { name: "Custom workflows", included: true },
        { name: "Advanced security", included: false },
        { name: "API access", included: false }
      ],
      buttonText: "Start Free Trial",
      isPopular: true
    },
    {
      name: "Enterprise Yearly",
      price: "₹9,999",
      period: "per year",
      description: "Advanced features for large enterprises",
      features: [
        { name: "Unlimited team members", included: true },
        { name: "Enterprise task management", included: true },
        { name: "Unlimited projects", included: true },
        { name: "Custom analytics", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "Custom workflows", included: true },
        { name: "Advanced security", included: true },
        { name: "API access", included: true }
      ],
      buttonText: "Contact Sales",
      isPopular: false
    }
  ];

  return (
    <section className="relative py-16 sm:py-20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose the Perfect Plan for Your Team
            </h2>
            <p className="text-lg text-gray-600">
              Simple, transparent pricing that grows with you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 ${
                  tier.isPopular 
                    ? 'bg-black text-white shadow-xl scale-105 border-2 border-white' 
                    : 'bg-white border-2 border-gray-100'
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm py-1 text-center">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className={`text-sm ${tier.isPopular ? 'text-gray-300' : 'text-gray-500'}`}>
                      {tier.period}
                    </span>
                  </div>
                  <p className={`mt-4 text-sm ${tier.isPopular ? 'text-gray-300' : 'text-gray-500'}`}>
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className={`w-5 h-5 ${tier.isPopular ? 'text-green-400' : 'text-green-500'}`} />
                      ) : (
                        <X className={`w-5 h-5 ${tier.isPopular ? 'text-gray-600' : 'text-gray-400'}`} />
                      )}
                      <span className={`text-sm ${
                        tier.isPopular 
                          ? feature.included ? 'text-white' : 'text-gray-400'
                          : feature.included ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg text-sm font-medium transition-colors ${
                    tier.isPopular
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;