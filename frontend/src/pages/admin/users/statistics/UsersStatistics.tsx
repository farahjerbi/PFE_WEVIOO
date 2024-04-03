import  { useEffect, useState } from 'react'
import './UsersStatistics.css'
import { MDBRow } from 'mdb-react-ui-kit'
import { Bar } from '@ant-design/plots';
import { useGetAllUsersMutation } from '../../../../redux/services/usersApi';
import { IUser } from '../../../../models/User';
import { toast } from 'sonner';
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection';

const UsersStatistics = () => {
  const [getAllUsers] = useGetAllUsersMutation();
  const [users, setUsers] = useState<IUser[]>([]);
  const [numberOfUsers, setNumberOfUsers] = useState<number>(0);
  const [numberOfEnabledUsers, setNumberOfEnabledUsers] = useState<number>(0);
  const [numberOfMFAEnabledUsers, setNumberOfMFAEnabledUsers] = useState<number>(0);
  const [numberOfUnEnabledUsers, setNumberOfUnEnabledUsers] = useState<number>(0);

  useEffect(() => {
    fetchDataUser();
  }, []);

  const data = [
    { year: 'Users Count', value: numberOfUsers },
    { year: 'Enabled Users', value: numberOfEnabledUsers },
    { year: 'MFA Users', value: numberOfMFAEnabledUsers },
    { year: 'Desactivated Users', value: numberOfUnEnabledUsers },
  ];


  const config = {
    data,
    xField: 'year',
    yField: 'value',
    shapeField: 'hollow',
    colorField: 'year',
    legend: {
      color: { size: 72, autoWrap: true, maxRows: 3, cols: 6 },
    },
  };

  const fetchDataUser = async () => {
    try {
      const response = await getAllUsers({}).unwrap();
      console.log("🚀 ~ fetchData ~ response:", response);
      setUsers(response);
      const enabledUsers = response.filter((user: IUser) => user.enabled === "true");
      const unEnabledUsers = response.filter((user: IUser) => user.enabled === "false");
      const mfaEnabledUsers = response.filter((user: IUser)  => user.mfaEnabled === "true");

      setNumberOfUsers(response.length);
      setNumberOfEnabledUsers(enabledUsers.length);
      setNumberOfMFAEnabledUsers(mfaEnabledUsers.length);
      setNumberOfUnEnabledUsers(unEnabledUsers.length);
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };
  return (
    <MDBRow className="mb-3 pt-5">
      <div className='d-flex '>
      <Bar {...config} height={390} width={600} className='barDiv' />
      <img src="../../../../assets/statistics.png" alt="" className='img'/>
      </div>
    </MDBRow>
 )
}

export default UsersStatistics