"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, Book, MessageCircle, Trophy, Clock, ArrowUpRight, 
  TrendingUp, DollarSign, BookOpen, PieChart, Activity,
  Filter, User, UserPlus, Calendar, BarChart as BarChartIcon
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from 'styles/components/ui/card';
import { Progress } from 'styles/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from 'styles/components/ui/avatar';
import { Badge } from 'styles/components/ui/badge';
import { 
  Tabs, TabsList, TabsTrigger, TabsContent 
} from 'styles/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from 'styles/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Brush } from 'recharts';
import Layout from 'app/components/Layout';

interface Params {
  podId: string;
}

interface Member {
  uid: string;
  displayName: string;
  avatar: string;
  progress: number;
  earnings: number;
  hoursThisWeek: number;
  status: 'online' | 'offline' | 'away';
  currentActivity: string;
  productiveTime?: string;
  isCurrentUser?: boolean;
}

interface RoadmapItem {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface ProgressData {
  week: string;
  user1?: number;
  user2?: number;
  user3?: number;
  user4?: number;
  user5?: number;
  currentUser?: number;
}

interface DailyProgressData {
  day: string;
  user1?: number;
  user2?: number;
  user3?: number;
  user4?: number;
  user5?: number;
  currentUser?: number;
}

interface HoursData {
  day: string;
  hours: number;
}

const PodDashboard = ({ params }: { params: Params }) => {
  const [podId, setPodId] = useState<string>("");
  const [podTitle, setPodTitle] = useState<string>("Python Mastery Pod");
  const [activeItem, setActiveItem] = useState(podId);
  const [progressPeriod, setProgressPeriod] = useState<'weekly' | 'daily'>('weekly');
  const [summaryView, setSummaryView] = useState<'pod' | 'personal' | 'member'>('pod');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [weeklyProgressData, setWeeklyProgressData] = useState<ProgressData[]>([]);
  const [dailyProgressData, setDailyProgressData] = useState<DailyProgressData[]>([]);
  const [hoursData, setHoursData] = useState<HoursData[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const resolvedParams = await params;
        setPodId(resolvedParams.podId);
      } catch (error) {
        console.error("Failed to fetch params:", error);
      }
    };

    fetchParams();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (podId != null && podId !== "" && podId !== "undefined") {
          const response = await fetch(`/api/getPod?uid=${podId}`);
          const data = await response.json();
          console.log(data);
    
          // Updating the states based on the fetched data
          setPodTitle(data.title);

        // Define types for roadmap item and the transformation
        const transformedRoadmap = data.roadmap.map((item: { task: string; week: string }, index: number) => ({
          id: (index + 1).toString(), // Unique id based on index
          title: item.task,           // Task is the title
          duration: item.week,        // Week range is the duration
          completed: false            // Default completed status
        }));

        console.log(transformedRoadmap);

        // Set the transformed roadmap data into state
        setRoadmap(transformedRoadmap);

          // Convert weekly progress data into an array
          const weeklyProgressArray = Object.entries(data.weeklyProgressData).map(([week, progress]) => ({
            week,
            user1: (progress as Record<string, number>)["3045xrWU0MO7HwH1Fwo1oEyRnJO2"] || 0, // Set default to 0 if undefined
            user2: (progress as Record<string, number>)["DIT52qtgvQfD55taKUTjkc0ARBx1"] || 0,
            user3: (progress as Record<string, number>)["GViBGtZnhpQ6SyBlCVrNh1Xh8zJ3"] || 0,
            currentUser: (progress as Record<string, number>)["currentUserId"] || 0 // Assuming currentUserId is available
          }));

          // Convert daily progress data into an array
          const dailyProgressArray = Object.entries(data.dailyProgressData).map(([day, progress]) => ({
            day,
            user1: (progress as Record<string, number>)["3045xrWU0MO7HwH1Fwo1oEyRnJO2"] || 0,
            user2: (progress as Record<string, number>)["DIT52qtgvQfD55taKUTjkc0ARBx1"] || 0,
            user3: (progress as Record<string, number>)["GViBGtZnhpQ6SyBlCVrNh1Xh8zJ3"] || 0,
            currentUser: (progress as Record<string, number>)["currentUserId"] || 0 // Again assuming this ID exists
          }));

          console.log(weeklyProgressArray);
          console.log(dailyProgressArray);

          // Set state with the transformed arrays
          setWeeklyProgressData(weeklyProgressArray);
          setDailyProgressData(dailyProgressArray);

          const hoursArray = Object.entries(data.hoursData).map(([day, data]) => ({
            day,
            hours: (data as { hours: number }).hours
          }));          
          setHoursData(hoursArray); // Assuming backend gives hoursData

          if (data.members && data.members.length > 0) {
            // Fetch all member details in parallel
            const memberDetails = await Promise.all(
              data.members.map(async (memberId: string) => {
                const memberResponse = await fetch(`/api/getUserByUID?uid=${memberId}`);
                if (!memberResponse.ok) throw new Error(`Failed to fetch member ${memberId}`);
                return await memberResponse.json();
              })
            );
    
            setMembers(memberDetails); // Update state with full member objects
          } else {
            setMembers([]); // No members
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
  
    if (podId != null && podId !== "" ) {
      fetchData();
    }
  }, [podId]);

  // Find current user
  const currentUser = JSON.parse(sessionStorage.getItem("user") || '{}');
  
  // Sort members by progress for leaderboard
  const sortedMembers = [...members].sort((a, b) => b.progress - a.progress);
  
  // Get top 3 users for progress chart
  const top3Users = sortedMembers.slice(0, 3);
  
  // Find the selected member for summary view
  const selectedMember = selectedMemberId ? 
    members.find(m => m.uid === selectedMemberId) : 
    currentUser;

  // Calculate pod statistics
  const podStats = {
    averageCompletion: Math.round(members.reduce((acc, m) => acc + m.progress, 0) / members.length),
    totalEarnings: (members.reduce((acc, m) => acc + (Number(m.earnings) || 0), 0)).toFixed(2),
    activeMembers: members.filter(m => m.status !== 'offline').length,
    completedModules: roadmap.filter(item => item.completed).length,
    totalModules: roadmap.length,
    currentFocus: roadmap.find(item => !item.completed)?.title || 'Final Review'
  };

  // Get personal stats if applicable
  console.log(currentUser);
  const personalStats = currentUser ? {
    completion: currentUser.progress,
    earnings: (Number(currentUser.earnings) || 0).toFixed(2),
    hoursThisWeek: currentUser.hoursThisWeek,
    rank: sortedMembers.findIndex(m => m.uid === currentUser.uid) + 1
  } : null;

  console.log(personalStats);
  
  // Get member stats if applicable
  const memberStats = selectedMember && !selectedMember.isCurrentUser ? {
    completion: selectedMember.progress,
    earnings: (Number(selectedMember.earnings) || 0).toFixed(2),
    hoursThisWeek: selectedMember.hoursThisWeek,
    rank: sortedMembers.findIndex(m => m.uid === selectedMember.uid) + 1
  } : null;

  return (
    <Layout defaultActiveItem={activeItem}>
      <div className="p-6 space-y-6">
        {/* Pod Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-3xl font-bold text-slate-900">{podTitle}</h1>
          <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
            <Users className="w-4 h-4 mr-2" />
            {members.length} Members
          </Badge>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Leaderboard - Spans 6 columns on md screens */}
          <Card className="md:col-span-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center text-slate-800">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  <span>Leaderboard</span>
                </CardTitle>
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                  Ranked by Progress
                </Badge>
              </div>
              <CardDescription className="text-slate-500">
                Member progress and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {sortedMembers.map((member, index) => (
                  <div key={member.uid} className="flex items-center space-x-4">
                    <div className="font-semibold text-lg w-6 text-slate-700">{index + 1}</div>
                    <Avatar className="border-2 border-white shadow-sm">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {member && member.displayName ? member.displayName.charAt(0) : 'N/A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-slate-900">
                          {member.displayName}
                          {member.isCurrentUser && (
                            <Badge variant="outline" className="ml-2 py-0 px-1.5 text-xs bg-blue-50 text-blue-700 border-blue-200">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-slate-700">{member.progress}%</div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                          <div
                            style={{ width: `${member.progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-sm">
                      <div className="flex items-center text-green-700 font-medium">
                        <DollarSign className="w-3.5 h-3.5 mr-1" />
                        <span>${(Number(member.earnings) || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center text-slate-500 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{member.hoursThisWeek}h this week</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Members Activity - Spans 6 columns on md screens */}
          <Card className="md:col-span-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center text-slate-800">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                <span>Members Activity</span>
              </CardTitle>
              <CardDescription className="text-slate-500">
                Current status and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {members.map(member => (
                  <div key={member.uid} className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                        {member && member.displayName ? member.displayName.charAt(0) : 'N/A'}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        member.status === 'online' ? 'bg-green-500' : 
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-900 truncate">{member.displayName}</span>
                        {member.isCurrentUser && (
                          <Badge variant="outline" className="py-0 px-1.5 text-xs bg-blue-50 text-blue-700 border-blue-200">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-500 mt-0.5">{member.currentActivity}</div>
                      
                      {member.status === 'online' && member.productiveTime && (
                        <div className="flex items-center mt-1.5 text-xs text-green-700">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Productive for {member.productiveTime}</span>
                        </div>
                      )}
                    </div>
                    <Badge
                      className={`text-xs px-2 py-0.5 ${
                        member.status === 'online' ? 'bg-green-100 text-green-800' : 
                        member.status === 'away' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {member.status === 'online' ? 'Online' : 
                      member.status === 'away' ? 'Away' : 'Offline'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Learning Roadmap - Spans 4 columns */}
          <Card className="md:col-span-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center text-slate-800">
                <Book className="w-5 h-5 mr-2 text-purple-600" />
                <span>Learning Roadmap</span>
              </CardTitle>
              <CardDescription className="text-slate-500">
                Course progression path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roadmap.map(item => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.completed ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.completed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span>{item.id}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${item.completed ? 'text-green-700' : 'text-slate-800'}`}>
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.duration}</div>
                    </div>
                    {/* {!item.completed && (
                      <div className="text-xs text-blue-600 whitespace-nowrap">Upcoming</div>
                    )} */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Progress Chart - Spans 8 columns */}
          <Card className="md:col-span-8 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-xl flex items-center text-slate-800">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  <span>Progress Chart</span>
                </CardTitle>
                <Select value={progressPeriod} onValueChange={(value: any) => setProgressPeriod(value)}>
                  <SelectTrigger className="w-36 h-8 text-sm border-slate-200">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                    <SelectItem value="daily">Daily Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription className="text-slate-500">
                Compare progress with top performers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressPeriod === 'weekly' ? weeklyProgressData : dailyProgressData}
                    margin={{ top: 5, right: 30, left: 5, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey={progressPeriod === 'weekly' ? 'week' : 'day'}
                      tick={{ fill: '#64748b' }}
                      tickMargin={10}
                    />
                    <YAxis
                      tick={{ fill: '#64748b' }}
                      tickMargin={10}
                      label={{
                        value: 'Progress (%)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: '#64748b' },
                      }}
                      domain={['dataMin']} // Adjust the zoom level to make progress more prominent
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderColor: '#e2e8f0',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '10px' }} />

                    {top3Users.length > 0 && (
                      <Line
                        type="monotone"
                        dataKey="user1"
                        name={`${top3Users[0]?.displayName} (1st)`}
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {top3Users.length > 1 && (
                      <Line
                        type="monotone"
                        dataKey="user2"
                        name={`${top3Users[1]?.displayName} (2nd)`}
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                      />
                    )}
                    {top3Users.length > 2 && (
                      <Line
                        type="monotone"
                        dataKey="user3"
                        name={`${top3Users[2]?.displayName} (3rd)`}
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                      />
                    )}
                    {currentUser && !top3Users.slice(0, 3).find((u) => u.uid === currentUser.uid) && (
                      <Line
                        type="monotone"
                        dataKey="currentUser"
                        name={`${currentUser.name} (You)`}
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4, strokeWidth: 2 }}
                      />
                    )}

                    {/* Brush Component for interactive zooming */}
                    <Brush
                      dataKey="week" // or "day" depending on the period
                      height={30}
                      stroke="#8884d8"
                      onChange={(brush) => {
                        if (brush) {
                          const { startIndex, endIndex } = brush;
                          // Apply changes to the chart data based on the brush selection
                          const zoomedData = (progressPeriod === 'weekly' ? weeklyProgressData : dailyProgressData).slice(
                            startIndex,
                            (endIndex !== undefined ? endIndex + 1 : weeklyProgressData.length)
                          );
                          // Update your chart data state based on zoomedData
                        }
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Weekly Hours - Spans 6 columns */}
          <Card className="md:col-span-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center text-slate-800">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                <span>Weekly Hours</span>
              </CardTitle>
              <CardDescription className="text-slate-500">
                Hours spent per day this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hoursData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      tick={{fill: '#64748b'}}
                      tickMargin={10}
                    />
                    <YAxis 
                      tick={{fill: '#64748b'}}
                      tickMargin={10}
                      label={{ 
                        value: 'Hours', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fill: '#64748b' }
                      }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} hours`]}
                      labelFormatter={(value) => `${value}`}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderColor: '#e2e8f0',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Bar 
                      dataKey="hours" 
                      fill="#3b82f6" 
                      name="Hours Spent"
                      radius={[4, 4, 0, 0]}
                    >
                      {hoursData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.hours > 5 ? '#3b82f6' : '#93c5fd'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Pod Summary - Spans 6 columns */}
          <Card className="md:col-span-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-xl flex items-center text-slate-800">
                  <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
                  <span>Pod Summary</span>
                </CardTitle>
                <Tabs value={summaryView} onValueChange={(value: any) => setSummaryView(value)} className="w-full sm:w-auto">
                  <TabsList className="grid w-full sm:w-auto grid-cols-3">
                    <TabsTrigger value="pod" className="text-xs sm:text-sm">Pod</TabsTrigger>
                    <TabsTrigger value="personal" className="text-xs sm:text-sm">Personal</TabsTrigger>
                    <TabsTrigger value="member" className="text-xs sm:text-sm">Member</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pod" className="mt-0">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-700">Average Completion</div>
                        <div className="font-bold text-slate-900">{podStats.averageCompletion}%</div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                          <div
                            style={{ width: `${podStats.averageCompletion}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-700">Total Earnings</div>
                        <div className="font-bold text-green-700">${podStats.totalEarnings}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-700">Active Members</div>
                        <div className="font-bold text-slate-900">{podStats.activeMembers}/{members.length}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-700">Roadmap Progress</div>
                        <div className="font-bold text-slate-900">{podStats.completedModules}/{podStats.totalModules}</div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                          <div
                            style={{ width: `${podStats.completedModules / podStats.totalModules * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                          ></div>
                        </div>
                      </div>
                                      
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="font-medium mb-2 text-slate-800">Current Focus</div>
                        <div className="text-sm text-slate-600">
                          {podStats.currentFocus}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="personal" className="mt-0">
                    {personalStats ? (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-slate-700">Your Completion</div>
                          <div className="font-bold text-slate-900">{personalStats.completion}%</div>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                            <div
                              style={{ width: `${personalStats.completion}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-slate-700">Your Earnings</div>
                          <div className="font-bold text-green-700">${personalStats.earnings}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-slate-700">Hours This Week</div>
                          <div className="font-bold text-slate-900">{personalStats.hoursThisWeek} hours</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-slate-700">Your Rank</div>
                          <div className="font-bold text-slate-900">#{personalStats.rank} of {members.length}</div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100">
                          <div className="font-medium mb-2 text-slate-800">Next Module</div>
                          <div className="text-sm text-slate-600">
                            {roadmap.find(item => !item.completed)?.title || 'Final Review'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-slate-500">
                        <User className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Personal stats not available</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="member" className="mt-0">
                    {memberStats ? (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-slate-700">Completion</div>
                          <div className="font-bold text-slate-900">{memberStats.completion}%</div>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                            <div
                              style={{ width: `${memberStats.completion}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-slate-700">Earnings</div>
                          <div className="font-bold text-green-700">${memberStats.earnings}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-slate-700">Hours This Week</div>
                          <div className="font-bold text-slate-900">{memberStats.hoursThisWeek} hours</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-slate-700">Rank</div>
                          <div className="font-bold text-slate-900">#{memberStats.rank} of {members.length}</div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100">
                          <div className="font-medium mb-2 text-slate-800">Status</div>
                          <Badge
                            className={`px-2 py-1 ${
                              selectedMember.status === 'online' ? 'bg-green-100 text-green-800' : 
                              selectedMember.status === 'away' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {selectedMember.status === 'online' ? 'Online' : 
                            selectedMember.status === 'away' ? 'Away' : 'Offline'}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-slate-500">
                        <UserPlus className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Select a member to view their stats</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              {summaryView === 'member' && (
                <div className="mt-2">
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger className="w-full h-8 text-sm border-slate-200">
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.filter(m => !m.isCurrentUser).map(member => (
                        <SelectItem key={member.uid} value={member.uid}>{member.displayName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <CardDescription className="text-slate-500 mt-2">
                {summaryView === 'pod' ? 'Key metrics overview' : 
                 summaryView === 'personal' ? 'Your personal stats' :
                 'Individual member statistics'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PodDashboard;