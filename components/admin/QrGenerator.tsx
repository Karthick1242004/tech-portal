'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Printer, Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { getVendors, generateVendorQR, type Vendor } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function QrGenerator() {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [qrToken, setQrToken] = useState<string>('');
  const [showQr, setShowQr] = useState(false);
  const [isLoadingVendors, setIsLoadingVendors] = useState(true);
  const [open, setOpen] = useState(false);

  // Load vendors on mount
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setIsLoadingVendors(true);
        const vendorData = await getVendors();
        setVendors(vendorData);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to load vendors',
          className: "text-white",
        });
      } finally {
        setIsLoadingVendors(false);
      }
    };

    loadVendors();
  }, [toast]);

  const generateQrCode = async () => {
    if (!selectedVendor) {
      return;
    }

    try {
      // Generate signed JWT token from backend
      const { token } = await generateVendorQR(selectedVendor);
      
      setQrToken(token);
      setShowQr(true);
    } catch (error: any) {
      console.error('Failed to generate QR:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'Could not generate QR code',
      });
    }
  };

  const handleRefresh = () => {
    generateQrCode();
  };

  const handlePrint = () => {
    window.print();
  };

  // Find selected vendor object for display
  const selectedVendorObj = vendors.find(v => v.Id === selectedVendor);

  return (
    <Card className="w-full max-w-md p-8 shadow-xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          QR Access Generator
        </h1>

        {/* Vendor Select (Searchable) */}
        <div className="space-y-2">
          <Label htmlFor="vendor">Select Vendor</Label>
          {isLoadingVendors ? (
            <div className="flex items-center justify-center h-10 border rounded-md bg-muted/50">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between font-normal text-left h-auto min-h-[40px] py-3"
                >
                  {selectedVendor ? (
                    <span className="truncate">
                      {selectedVendorObj?.Description} ({selectedVendor})
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Select a vendor...</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Search vendor..." />
                  <CommandList>
                    <CommandEmpty>No vendor found.</CommandEmpty>
                    <CommandGroup>
                      {vendors.map((vendor) => (
                        <CommandItem
                          key={vendor.Id}
                          value={vendor.Description + ' ' + vendor.Id} // Allow search by ID too
                          onSelect={() => {
                            setSelectedVendor(vendor.Id === selectedVendor ? "" : vendor.Id);
                            setOpen(false);
                            // Reset QR when vendor changes
                            setShowQr(false);
                            setQrToken('');
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedVendor === vendor.Id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{vendor.Description}</span>
                            <span className="text-xs text-muted-foreground">{vendor.Id}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateQrCode}
          className="w-full"
          size="lg"
          disabled={!selectedVendor || isLoadingVendors}
        >
          Generate QR Code
        </Button>

        {/* QR Code Display */}
        {showQr && qrToken && (
          <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* QR Code */}
            <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-border shadow-sm">
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
                className="flex-1 bg-transparent hover:bg-muted"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1 bg-transparent hover:bg-muted"
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
