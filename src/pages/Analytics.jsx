import React, { useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TASK_STATUSES } from '../constants';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Analytics.module.css';

// Define colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const { tasks, loading } = useTasks();

  const analyticsData = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        completionRate: 0,
        statusDistribution: [],
        tasksPerUser: [],
      };
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Data for Pie Chart (Tasks by Status)
    const statusDistribution = TASK_STATUSES.map(status => ({
      name: status,
      value: tasks.filter(task => task.status === status).length,
    })).filter(item => item.value > 0);

    // Data for Bar Chart (Tasks per User)
    const userTaskCounts = tasks.reduce((acc, task) => {
      if (task.assignee) {
        acc[task.assignee.name] = (acc[task.assignee.name] || 0) + 1;
      } else {
        acc['Unassigned'] = (acc['Unassigned'] || 0) + 1;
      }
      return acc;
    }, {});

    const tasksPerUser = Object.entries(userTaskCounts).map(([name, count]) => ({
      name,
      tasks: count,
    }));

    return { totalTasks, completedTasks, completionRate, statusDistribution, tasksPerUser };
  }, [tasks]);

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Project Analytics</h1>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h3>Total Tasks</h3>
          <p>{analyticsData.totalTasks}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Completed Tasks</h3>
          <p>{analyticsData.completedTasks}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Completion Rate</h3>
          <p>{analyticsData.completionRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {analyticsData.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Tasks Assigned per User</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.tasksPerUser}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;