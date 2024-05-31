import  { useEffect, useState } from 'react'
import './UsersStatistics.css'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBRow } from 'mdb-react-ui-kit'
import { IUser } from '../../../../models/user/User';
import { useSelector } from 'react-redux';
import { selectUsers } from '../../../../redux/state/usersSlice';
import { BarChart } from '@mui/x-charts/BarChart';

const UsersStatistics = () => {
  const users=useSelector(selectUsers)
  const numberOfEnabledUsers = users?.filter((user: IUser) => user.enabled === "true").length || null;
  const numberOfUnEnabledUsers = users?.filter((user: IUser) => user.enabled === "false").length || null;
  const numberOfMFAEnabledUsers = users?.filter((user: IUser)  => user.mfaEnabled === "true").length || null;

  return (
    <MDBCard className="mb-5">
      <MDBCardBody>
      <MDBCardTitle>Statistics Users</MDBCardTitle>
      <div className='d-flex '>
      {/* <img src="../../../../assets/statistics.png" alt="" className='img'/> */}
      <BarChart
        xAxis={[{ scaleType: 'band', data: ['Enabled', 'MFA', 'Unactive'] }]}
        series={[
          {
            data: [numberOfEnabledUsers, numberOfMFAEnabledUsers, numberOfUnEnabledUsers],
            color:"rgb(184, 180, 214)"
          }
        ]}
        width={300}
        height={200}
      />
      </div>
      </MDBCardBody>
    </MDBCard>
 )
}

export default UsersStatistics