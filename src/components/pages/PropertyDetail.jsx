import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { inquiryService } from "@/services/api/inquiryService";
import ApperIcon from "@/components/ApperIcon";
import PropertyGallery from "@/components/organisms/PropertyGallery";
import Badge from "@/components/atoms/Badge";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { savedPropertyService } from "@/services/api/savedPropertyService";
import { propertyService } from "@/services/api/propertyService";

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const [isSaved, setIsSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    email: '',
    message: ''
  })
  const [inquiryLoading, setInquiryLoading] = useState(false)
  useEffect(() => {
    loadProperty()
    checkIfSaved()
  }, [id])

  const loadProperty = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await propertyService.getById(id)
      setProperty(data)
    } catch (err) {
      setError(err.message || 'Failed to load property')
      toast.error('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }

  const checkIfSaved = async () => {
    try {
      const saved = await savedPropertyService.isPropertySaved(id)
      setIsSaved(saved)
    } catch (err) {
      console.error('Error checking saved status:', err)
    }
  }

  const handleSaveToggle = async () => {
    setSaveLoading(true)
    try {
      if (isSaved) {
        const savedProperties = await savedPropertyService.getAll()
        const savedProperty = savedProperties.find(s => s.propertyId === id)
        if (savedProperty) {
          await savedPropertyService.delete(savedProperty.Id)
          setIsSaved(false)
          toast.success('Property removed from saved list')
        }
      } else {
        await savedPropertyService.create({
          propertyId: id,
          notes: ''
        })
        setIsSaved(true)
        toast.success('Property saved successfully')
      }
    } catch (err) {
      toast.error('Failed to update saved properties')
    } finally {
      setSaveLoading(false)
    }
  }

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }
  const handleInquirySubmit = async (e) => {
    e.preventDefault()
    
    if (!inquiryForm.email || !inquiryForm.message) {
      toast.error('Please fill in all fields')
      return
    }

    setInquiryLoading(true)
    try {
      await inquiryService.create({
        email: inquiryForm.email,
        message: inquiryForm.message,
        propertyId: id
      })
      
      setInquiryForm({ email: '', message: '' })
      toast.success('Your inquiry has been sent successfully!')
    } catch (err) {
      toast.error('Failed to send inquiry. Please try again.')
    } finally {
      setInquiryLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setInquiryForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
  if (loading) return <Loading type="detail" />
  if (error) return <Error message={error} onRetry={loadProperty} />
  if (!property) return <Error message="Property not found" />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center"
      >
        <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
        Back to Properties
      </Button>

      {/* Property Gallery */}
      <PropertyGallery images={property.images} title={property.title} />

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600">
                  <ApperIcon name="MapPin" size={16} className="mr-1" />
                  <span>
                    {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                  </span>
                </div>
              </div>
              <Button
                variant={isSaved ? 'accent' : 'ghost'}
                onClick={handleSaveToggle}
                disabled={saveLoading}
                className="flex items-center"
              >
                <ApperIcon 
                  name="Heart" 
                  size={16} 
                  className={`mr-2 ${isSaved ? 'fill-current' : ''}`}
                />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <Badge variant="accent" className="text-lg font-bold px-4 py-2">
                {formatPrice(property.price)}
              </Badge>
              <Badge variant="secondary">
                {property.propertyType}
              </Badge>
              <Badge variant="primary">
                {property.status}
              </Badge>
            </div>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <ApperIcon name="Bed" size={24} className="mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
              <div className="text-sm text-gray-600">Bedrooms</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <ApperIcon name="Bath" size={24} className="mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
              <div className="text-sm text-gray-600">Bathrooms</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <ApperIcon name="Square" size={24} className="mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-gray-900">{property.squareFeet.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Sq Ft</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <ApperIcon name="Calendar" size={24} className="mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-gray-900">
                {new Date(property.listingDate).getFullYear()}
              </div>
              <div className="text-sm text-gray-600">Listed</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
              Features & Amenities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ApperIcon name="Check" size={16} className="text-success" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
</div>
          </div>

          {/* Neighborhood Information */}
          {property.neighborhoodInfo && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
                Neighborhood Information
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.neighborhoodInfo}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
<div className="space-y-6">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
              Contact Agent
            </h3>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={inquiryForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </Label>
                <textarea
                  id="message"
                  value={inquiryForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="I'm interested in this property..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={inquiryLoading}
                className="w-full"
              >
                {inquiryLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" size={16} className="mr-2" />
                    Send Inquiry
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <ApperIcon name="Phone" size={14} className="mr-1" />
                  Call
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <ApperIcon name="Calendar" size={14} className="mr-1" />
                  Tour
                </Button>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
              Location
            </h3>
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ApperIcon name="Map" size={48} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Interactive map coming soon</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium">{property.address.street}</p>
              <p>{property.address.city}, {property.address.state} {property.address.zipCode}</p>
            </div>
          </div>

          {/* Similar Properties */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
              Similar Properties
            </h3>
            <div className="text-center text-gray-600">
              <ApperIcon name="Home" size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Similar properties will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyDetail