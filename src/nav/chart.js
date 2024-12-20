import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

function MyChart() {
  const [chartData, setChartData] = useState({ income: 0, expense: 0 });
  const chartInstance = useRef(null);

  useEffect(() => {
    // ดึงข้อมูลจาก Strapi API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/txactions');
        const transactions = response.data.data;

        // แยกข้อมูลรายรับและรายจ่าย
        const income = transactions
          .filter((item) => item.attributes.type === 'Income')
          .reduce((sum, item) => sum + item.attributes.amount, 0);

        const expense = transactions
          .filter((item) => item.attributes.type === 'Expense')
          .reduce((sum, item) => sum + item.attributes.amount, 0);

        setChartData({ income, expense });
      } catch (error) {
        console.error('Error fetching data from Strapi:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData.income || chartData.expense) {
      const ctx = document.getElementById('myChart').getContext('2d');

      // ทำลายกราฟเก่าถ้ามี
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // สร้างกราฟใหม่
      chartInstance.current = new Chart(ctx, {
        type: 'pie', // เปลี่ยนเป็น pie หรือ bar ตามต้องการ
        data: {
          labels: ['Income', 'Expense'],
          datasets: [
            {
              label: 'Income vs Expense',
              data: [chartData.income, chartData.expense],
              backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.raw;
                  return `${context.label}: ${value.toLocaleString()} THB`;
                },
              },
            },
          },
        },
      });
    }

    // ทำลายกราฟเมื่อ component ถูก unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div>
      <canvas id="myChart"></canvas>
    </div>
  );
}

export default MyChart;
