'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Printer } from 'lucide-react';

const MOCK_VENDORS = [
  { id: 'vendor-1', name: 'ACME Industrial Services' },
  { id: 'vendor-2', name: 'TechMaint Solutions' },
  { id: 'vendor-3', name: 'ProService Industries' },
  { id: 'vendor-4', name: 'Global Maintenance Corp' },
];

const MOCK_PLANTS = [
  { id: 'plant-1', name: 'Plant A - Rotterdam' },
  { id: 'plant-2', name: 'Plant B - Amsterdam' },
  { id: 'plant-3', name: 'Plant C - Hamburg' },
  { id: 'plant-4', name: 'Plant D - Antwerp' },
];

export function QrGenerator() {
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [selectedPlant, setSelectedPlant] = useState<string>('');
  const [qrToken, setQrToken] = useState<string>('');
  const [showQr, setShowQr] = useState(false);

  const generateQrCode = () => {
    if (!selectedVendor || !selectedPlant) {
      return;
    }

    // Generate a mock JWT-like token
    const token = btoa(
      JSON.stringify({
        vendorId: selectedVendor,
        plantId: selectedPlant,
        timestamp: Date.now(),
        expiresIn: 1800000, // 30 minutes in ms
      })
    );

    setQrToken(token);
    setShowQr(true);
  };

  const handleRefresh = () => {
    generateQrCode();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="w-full max-w-md p-8 shadow-xl">
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          QR Access Generator
        </h1>

        {/* Vendor Select */}
        <div className="space-y-2">
          <Label htmlFor="vendor">Select Vendor</Label>
          <Select value={selectedVendor} onValueChange={setSelectedVendor}>
            <SelectTrigger id="vendor">
              <SelectValue placeholder="Select a vendor" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_VENDORS.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Plant Select */}
        <div className="space-y-2">
          <Label htmlFor="plant">Select Plant</Label>
          <Select value={selectedPlant} onValueChange={setSelectedPlant}>
            <SelectTrigger id="plant">
              <SelectValue placeholder="Select a plant" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_PLANTS.map((plant) => (
                <SelectItem key={plant.id} value={plant.id}>
                  {plant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateQrCode}
          className="w-full"
          size="lg"
          disabled={!selectedVendor || !selectedPlant}
        >
          Generate QR Code
        </Button>

        {/* QR Code Display */}
        {showQr && qrToken && (
          <div className="space-y-4 pt-4">
            {/* QR Code */}
            <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-border">
              <QRCodeSVG value={qrToken} size={200} level="H" />
            </div>

            {/* Validity Notice */}
            <p className="text-center text-sm text-muted-foreground">
              QR valid for 30 minutes
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex-1 bg-transparent"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1 bg-transparent"
                size="lg"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
