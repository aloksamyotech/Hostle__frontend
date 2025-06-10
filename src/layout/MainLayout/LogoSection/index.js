// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// // material-ui
// import { ButtonBase } from '@mui/material';

// // project imports
// import config from 'config';
// import Logo from 'ui-component/Logo';
// import { MENU_OPEN } from 'store/actions';

// // ==============================|| MAIN LOGO ||============================== //

// const LogoSection = () => {
//   const defaultId = useSelector((state) => state.customization.defaultId);
//   const dispatch = useDispatch();
//   return (
//     <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>
//       <Logo />
//     </ButtonBase>
//   );
// };

// export default LogoSection;

import { useEffect, useState } from 'react';

// import Logo from 'ui-component/HotelCRM-logo.png';
// import Logo from '../../../assets/images/HMS1.png';
import { ButtonBase } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import Logo from '../../../assets/images/hostelCRMLogo.png'


const LogoSection = () => {
  // useEffect(() => {
  //     const HosId = Cookies.get('_Id');
  //     if (HosId) {
  //       setHostelId(HosId);
  //     }
  //     fetchProfileData(HosId);
  //   }, [open]);
  // const hotel = JSON.parse(localStorage.getItem('hotelData'));

  const hostelId = Cookies.get('_Id');

  const [logoUrl, setLogoUrl] = useState();
  const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

  const fetchHotelData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/hostel/view/${hostelId}`);

      const imageUrl = response?.data?.result?.hostelphoto
        ? `${process.env.REACT_APP_BACKEND_URL}${response?.data?.result?.hostelphoto}`
        : Logo;
      
      setLogoUrl(imageUrl);
    } catch (error) {
      console.log('Error fetching hotel data:', error);
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, [hostelId]);

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
          e.target.src = Logo;
        }}
      />
    </ButtonBase>
  );
};

export default LogoSection;
