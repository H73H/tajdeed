export default function GuidesIndex() {
  const guides = [
    {slug:'emirates_id', title:'Emirates ID Renewal'},
    {slug:'car_registration', title:'Car Registration Renewal'},
    {slug:'drivers_license', title:'Driver’s License Renewal'},
    {slug:'visa', title:'Visa Renewal'},
    {slug:'insurance', title:'Health Insurance Renewal'},
    {slug:'tenancy', title:'Tenancy Contract Renewal'},
    {slug:'trade_license', title:'Trade License Renewal'},
    {slug:'passport', title:'Passport Renewal'}
  ]
  return (
    <main className="space-y-4">
      <h2 className="text-2xl font-bold">Renewal Guides</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {guides.map(g => (
          <a key={g.slug} className="card" href={`/guides/${g.slug}`}>
            {g.title}
          </a>
        ))}
      </div>
      <p className="text-sm opacity-70">These are simple checklists. Edit the content files to localize for each emirate.</p>
    </main>
  )
}
