import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import axios from 'axios';

export default function IncomeExpenseChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // ดึงข้อมูลจาก Strapi API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/txactions'); // URL ของ Strapi API
        const transactions = response.data.data;

        // สรุปข้อมูลรายรับรายจ่าย
        const summary = transactions.reduce(
          (acc, transaction) => {
            if (transaction.attributes.type === 'income') {
              acc.income += transaction.attributes.amount;
            } else if (transaction.attributes.type === 'expense') {
              acc.expense += transaction.attributes.amount;
            }
            return acc;
          },
          { income: 0, expense: 0 } // ค่าเริ่มต้น
        );

        // เก็บข้อมูลใน state
        setChartData({
          labels: ['Income', 'Expense'], // แกน x
          datasets: [
            {
              label: 'Amount',
              data: [summary.income, summary.expense], // รายรับและรายจ่าย
              backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data from Strapi:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData) {
      // สร้างกราฟเมื่อมีข้อมูล
      const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar', // ประเภทกราฟ
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true, // เริ่มจาก 0
            },
          },
        },
      });

      return () => {
        chart.destroy(); // ลบกราฟเก่าเมื่อ component ถูก unmount
      };
    }
  }, [chartData]);

  return <canvas id="incomeExpenseChart"></canvas>; // พื้นที่สำหรับกราฟ
}
