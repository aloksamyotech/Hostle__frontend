import { useEffect, useState } from 'react';

import { ButtonBase } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import Logo from '../../../assets/images/hostelCRMLogo.png';
import LogoMain from '../../../assets/images/admin-logo.png';

const LogoSection = () => {
  const hostelId = Cookies.get('_Id');

  const [logoUrl, setLogoUrl] = useState(LogoMain);
  const BaseURL = process.env.REACT_APP_BACKEND_URL;
  const baseUrl = process.env.REACT_APP_BACKEND_URL_IMG || 'http://localhost:4000';

  const fetchHotelData = async () => {
    try {
      const response = await axios.get(`${BaseURL}/hostel/view/${hostelId}`);

      const photo = response?.data?.result?.hostelphoto;

      const fullImageUrl = photo ? `${baseUrl}${photo}` : LogoMain;

      setLogoUrl(fullImageUrl);
    } catch (error) {
      console.log('Error fetching hotel data:', error);
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, []);

  return (
    <ButtonBase disableRipple>
      <img
        src={logoUrl}
        alt="logo"
        style={{
          width: '178px',
          height: '40px',
          objectFit: 'cover',
          overflow: 'hidden'
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = LogoMain;
        }}
      />
    </ButtonBase>
  );
};

export default LogoSection;
