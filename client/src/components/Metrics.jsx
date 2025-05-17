import React, { useState, useEffect } from 'react';

const Metrics = () => {

    const [volunteers, setVolunteers] = useState(0);
    const [beneficiaries, setBeneficiaries] = useState(0);
    const [quantitySum, setQuantitySum] = useState(0);
    const [weightSum, setWeightSum] = useState(0);

    // useEffect(() => {
    //     const db = getDatabase();
    //     const requestsRef = ref(db, 'donationRequests');
    //     const usersRef = ref(db, 'users');

    //     onValue(requestsRef, (snapshot) => {
    //         const data = snapshot.val();
    //         console.log(data);

    //         if (data) {
    //             const totalQuantity = Object.values(data).reduce((sum, request) => sum + (parseFloat(request.foodQuantity) || 0), 0);
    //             const totalWeight = Object.values(data).reduce((sum, request) => sum + (parseFloat(request.foodWeight) || 0), 0);

    //             setQuantitySum(totalQuantity);
    //             setWeightSum(totalWeight);
    //         }
    //     });

    //     onValue(usersRef, (snapshot) => {
    //         const usersData = snapshot.val();
    //         console.log(usersData);

    //         if (usersData) {
    //             const totalVolunteers = Object.values(usersData).filter(user => user.account_type === 'volunteer').length;
    //             const totalBeneficiaries = Object.values(usersData).filter(user => user.account_type === 'donor').length;

    //             setVolunteers(totalVolunteers);
    //             setBeneficiaries(totalBeneficiaries);
    //         }
    //     });
    // }, []);
    useEffect(() => {
      const fetchMetrics = async () => {
        try {
          const res = await fetch('http://localhost:5001/api/metrics');
          const data = await res.json();
          setQuantitySum(data.quantitySum);
          setWeightSum(data.weightSum);
          setVolunteers(data.volunteers);
          setBeneficiaries(data.donors);
        } catch (error) {
          console.error('Failed to fetch metrics:', error);
        }
      };
    
      fetchMetrics();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-center mb-4">Our Impact</h1>
          <div className="flex flex-wrap justify-center mb-3">
            <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
              <div className="bg-green-500 text-white h-full rounded-lg shadow-md">
                <div className="p-6" >
                  <div className="flex justify-center mb-4">
                    <i className="fa fa-apple-alt text-6xl"></i>
                  </div>
                  <h6 className="text-center uppercase text-sm font-semibold">Food Items Donated</h6>
                  <h1 className="text-center text-4xl font-bold">{quantitySum + "+"}</h1>
                </div>
              </div>
            </div>
      
            <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
              <div className="bg-red-500 text-white h-full rounded-lg shadow-md">
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <i className="fa fa-cutlery text-6xl"></i>
                  </div>
                  <h6 className="text-center uppercase text-sm font-semibold">Meals Provided</h6>
                  <h1 className="text-center text-4xl font-bold">{weightSum + "+"}</h1>
                </div>
              </div>
            </div>
      
            <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
              <div className="bg-blue-400 text-white h-full rounded-lg shadow-md">
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <i className="fa fa-hands-helping text-6xl"></i>
                  </div>
                  <h6 className="text-center uppercase text-sm font-semibold">Our Recievers</h6>
                  <h1 className="text-center text-4xl font-bold">{volunteers + " +"}</h1>
                </div>
              </div>
            </div>
      
            <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
              <div className="bg-yellow-400 text-white h-full rounded-lg shadow-md">
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <i className="fa fa-users text-6xl"></i>
                  </div>
                  <h6 className="text-center uppercase text-sm font-semibold">Our Donors</h6>
                  <h1 className="text-center text-4xl font-bold">{beneficiaries + " +"}</h1>
                </div>
              </div>
            </div>
      
          </div>
        </div>
      );
    }      
      export default Metrics;
