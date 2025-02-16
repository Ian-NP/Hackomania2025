"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Input } from '@/styles/components/ui/input';
import { Label } from '@/styles/components/ui/label';
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentsPage() {


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('hash') && urlParams.get('interact_ref')) {
          const uid =  JSON.parse(sessionStorage.getItem("user"))["uid"]
            fetch(`/api/transaction/setref?uid=${uid}&ref=${urlParams.get('interact_ref')}`)
            setStatus('success');
        } else if (urlParams.get('result') === 'grant_rejected') {
            setStatus('rejected');
        }
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (grantUrl != ""){
        return
      }
        console.log("running twice?")
        setLoading(true);
        setError('');
        
        try {
            const uid =  JSON.parse(sessionStorage.getItem("user"))["uid"]
            const senderwallets =  await fetch(`/api/getwallet?uid=${uid}`)
            const senderwallet = await senderwallets.json()
            const response = await fetch(`/api/transaction?senderwalletid=${encodeURIComponent(senderwallet.wallet)}&uid=${uid}&amount=${amount*100}&walletid=${encodeURIComponent(walletId)}`);
            const data = await response.json();
            setGrantUrl(data.grantUrl);
        } catch (err) {
            setError('Failed to initialize payment. Please try again.');
            console.error("Error fetching payment data:",   err);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthorize = () => {
        if (grantUrl) {
          console.log("running the stupid green bytton")
            window.location = grantUrl;
        }
    };

    const handleReset = () => {
        window.location.href = window.location.pathname;
    };

    const StatusCard = ({ type }) => {
        const config = {
            success: {
                icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
                title: 'Payment Successful!',
                message: 'Your payment has been processed successfully.',
                buttonText: 'Make Another Payment',
                buttonColor: 'bg-green-600 hover:bg-green-700'
            },
            rejected: {
                icon: <XCircle className="h-16 w-16 text-red-500" />,
                title: 'Payment Rejected',
                message: 'Your payment was not authorized. Please try again.',
                buttonText: 'Try Again',
                buttonColor: 'bg-red-600 hover:bg-red-700'
            }
        };

        const content = config[type];

        return (
            <Card className="w-full max-w-md">
                <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col items-center space-y-6">
                        {content.icon}
                        <h2 className="text-2xl font-semibold text-gray-900">{content.title}</h2>
                        <p className="text-gray-600 text-center text-lg">
                            {content.message}
                        </p>
                        <Button 
                            onClick={handleReset}
                            className={`${content.buttonColor} text-white w-full max-w-xs`}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {content.buttonText}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (status) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <StatusCard type={status} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold">
                            Make a Payment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-600 text-center">{error}</p>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-gray-700">Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="walletId" className="text-gray-700">Wallet ID</Label>
                                <Input
                                    id="walletId"
                                    type="text"
                                    placeholder="Enter wallet ID"
                                    value={walletId}
                                    onChange={(e) => setWalletId(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>

                            {!grantUrl ? (
                                <Button 
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-medium"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Continue to Payment'
                                    )}
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleAuthorize}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-medium"
                                >
                                    Authorize Payment
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}