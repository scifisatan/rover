import Form from "./Form"

export default function BusinessFormPage() {
  return (
    <div className="container mx-auto px-4 py-10 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8 text-center animate-fade-in">Create Your Business Profile</h1>
      <Form />
    </div>
  )
}

