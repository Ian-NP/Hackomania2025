"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "lib/firebaseClient";
import Layout from "app/components/Layout";
import { Bell, Clock, DollarSign, BookOpen, Target, Zap } from 'lucide-react';

const ProdigiCommunity = () => {
  interface UserData {
    displayName?: string;
    productiveTime?: string;
    earnings?: number;
    distractionCount?: number;
    currentActivity?: string;
    progress?: number;
  }
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    // Get user data from sessionStorage
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    return () => unsubscribe();
  }, [router]);

  // Calculate today's date
  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US');

  // If userData is not loaded yet, show loading
  if (!userData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout defaultActiveItem="home">
      <main className="max-w-5xl h-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4 auto-rows-auto w-full">
          {/* Welcome Card - Spans all columns on desktop */}
          <div className="col-span-1 sm:col-span-4 lg:col-span-4 row-span-1 bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Hey, {userData.displayName ? userData.displayName.split(' ')[0] : 'there'}!
              </h1>
              <p className="text-gray-600 mt-1">{formattedDate}</p>
              <p className="text-gray-600 mt-2">You're making great progress today!</p>
            </div>
          </div>

          {/* Productive Time Card - Occupies 1 column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 bg-indigo-50 rounded-xl shadow overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-900">Focus Time</h2>
                <Clock className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-indigo-700">{userData.productiveTime || '0m'}</p>
              <p className="text-xs text-indigo-600">This Week's Focus Time</p>
            </div>
          </div>
          
          {/* Earnings Card - Occupies 1 column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 bg-green-50 rounded-xl shadow overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-900">Earnings</h2>
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-green-700">
              
                ${userData.earnings ? (Number(userData.earnings) || 0).toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-green-600">Overall</p>
            </div>
          </div>
          
          {/* Focus Score Card - Occupies 1 column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 bg-orange-50 rounded-xl shadow overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-900">No. of Distractions</h2>
                <Target className="h-4 w-4 text-orange-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-orange-700">
                {userData.distractionCount}
                {/* <span className="text-lg text-orange-500">/10</span> */}
              </p>
              <p className="text-xs text-orange-600">
                Distractions Today
              </p>
            </div>
          </div>
          
          {/* Streak Card - Occupies 1 column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 bg-purple-50 rounded-xl shadow overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-900">Streak</h2>
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-purple-700">7</p>
              <p className="text-xs text-purple-600">days</p>
            </div>
          </div>

          {/* Current Activity Card - Spans all columns on desktop */}
          <div className="col-span-1 sm:col-span-4 lg:col-span-4 row-span-2 bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Current Activity</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  In Progress
                </span>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium"><strong>{userData.currentActivity || 'No active task'}</strong></h3>
                  <div className="mt-4 mb-2">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-indigo-600">
                            Progress: {userData.progress || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-indigo-200">
                        <div 
                          style={{ width: `${userData.progress || 0}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 rounded-full">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    <p className="font-bold">Next milestone: Complete Basic Syntax section</p>
                    <p className="mt-1">Estimated completion: 3 more days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </Layout>
  );
};

export default ProdigiCommunity;