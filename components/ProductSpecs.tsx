interface Specification {
  key: string
  value: string
}

export default function ProductSpecs({ specifications }: { specifications?: Specification[] }) {
  if (!specifications || specifications.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6">Best selling</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specifications.map((spec, index) => (
          <div key={index} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
            <span className="text-gray-600">{spec.key}</span>
            <span className="font-medium text-gray-900">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
