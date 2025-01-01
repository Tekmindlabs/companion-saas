"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const mockData = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 300 },
  { name: "Mar", users: 600 },
  { name: "Apr", users: 800 },
  { name: "May", users: 700 }
];

export function AdminDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Total Users</h3>
        <p className="text-3xl font-bold">1,234</p>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Active Sessions</h3>
        <p className="text-3xl font-bold">56</p>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">System Health</h3>
        <p className="text-3xl font-bold text-green-500">98%</p>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Storage Used</h3>
        <p className="text-3xl font-bold">45%</p>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4 p-6">
        <h3 className="font-semibold mb-4">User Growth</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#8884d8" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}