import {createAsyncThunk, createSelector, createSlice , PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import { IUser, UserPayload } from "../../models/user/User";
import { Role } from "../../models/user/Role";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { DecodedToken } from "../../models/authentication/DecodedToken";
import { IContact } from "../../models/user/Contact";
import { ITeam, ITeamWithContact } from "../../models/user/Team";


  export const decodeToken = createAsyncThunk<IUser | null, void>(
    "auth/decodeToken",
    async (_, { rejectWithValue }) => {
        let token = localStorage.getItem("token");
        console.log("🚀 ~ token:", token)
        if (token && token.startsWith('"') && token.endsWith('"')) {
          token = token.substring(1, token.length - 1);
      }
        if (token) {
          
            try {
                const decodedToken: DecodedToken = jwtDecode(token);
                const userEmail = decodedToken.sub;
                const response = await axios.get<IUser>(
                  `http://localhost:8099/api/users/getUserByEmail/${userEmail}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                    },
                  }
                );
                console.log("🚀 ~ response:", response)
                return response.data;
            } catch (error) {
                return rejectWithValue(null);
            }
        }
        return null;
    }
);

export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
      
    } catch (error) {
      return true;
    }
  
  };



export interface AuthState{
    user: IUser | null;
    isAuthorized: boolean;
    token: string | null;
    role: Role | null;
    contact: IContact[] | null;
    team: ITeam[] | null;
    contactDetails:IContact | null;
    teamDetails:ITeam| null;
    teamsWithContacts: ITeamWithContact[] | null;
}

const initialState: AuthState={
    user:null,
    token: localStorage.getItem("token"),
    isAuthorized: false,
    role:null,
    contact:null,
    team:null,
    contactDetails:null,
    teamDetails:null,
    teamsWithContacts:null
}


export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
      addContact(state, action: PayloadAction<IContact>) {
        if (state.contact) {
          state.contact.push(action.payload);
        }
      },
      addContacts(state, action: PayloadAction<IContact[]>) {
        if (state.contact) {
        state.contact.push(...action.payload);
      }
    },
      updateContact(state, action: PayloadAction<IContact>) {
        if (state.contact) {
            const index = state.contact.findIndex((c: IContact) => c.id === action.payload.id);
            if (index !== -1) {
               state.contact[index]=action.payload
            }
          }        
      },
      updateTeamAndContacts(state, action: PayloadAction<ITeam>) {
        if (state.team) {
          const teamIndex = state.team.findIndex(team => team.id === action.payload.id);
          if (teamIndex !== -1) {
            state.team[teamIndex] = action.payload;
            
            if (state.contact) {
              state.contact.forEach(contact => {
                const teamIndexInContact = contact.teams.findIndex(team => team.id === action.payload.id);
                if (teamIndexInContact !== -1) {
                  contact.teams[teamIndexInContact] = action.payload;
                }
              });
            }
          }
        }
      },  
      setDeleteContact(state, action: PayloadAction<number>) {
        if (state.contact) {
          state.contact = state.contact.filter((push: IContact) => push.id !== action.payload);
        }
      },
      setDeleteTeam(state, action: PayloadAction<number>) {
        const teamId = action.payload;
      
        if (state.team && Array.isArray(state.team)) {
          state.team = state.team.filter(team => team.id !== teamId);
        }
        if (state.contact && Array.isArray(state.contact)) {
          state.contact.forEach(contact => {
            if (contact.teams && Array.isArray(contact.teams)) {
              contact.teams = contact.teams.filter(team => team.id !== teamId);
            }
          });
        }
      },      
      addTeam(state, action: PayloadAction<ITeam>) {
        if (state.team) {
          state.team.push(action.payload);
        }
      },
        setUser:(
            state, 
            action : PayloadAction<UserPayload>
            )=>{
            localStorage.setItem("token",JSON.stringify(action.payload.token));
            state.user=action.payload.user;
            state.token=action.payload.token;
            state.role=action.payload.user.role;
            state.isAuthorized=true;
            if (action.payload && action.payload.user && action.payload.user.members) {
              const allTeams: ITeam[] = [];
              action.payload.user.members.forEach((member) => {
                  if (member?.teams && Array.isArray(member.teams)) {
                      member.teams.forEach((team) => {
                          if (!allTeams.some((m) => m.id === team.id)) {
                              allTeams.push(team);
                          }
                      });
                  }
              });
              state.team = allTeams;
          }
                 
            state.contact = action.payload?.user?.members ?? null;

        },
        setUpdatedUser:(
          state, 
          action : PayloadAction<IUser>
          )=>{
          state.user=action.payload;
      },
      setContactDetails:(
        state, 
        action : PayloadAction<IContact|null>
        )=>{
        state.contactDetails=action.payload;
        },
        setTeamDetails:(
          state, 
          action : PayloadAction<ITeam|null>
          )=>{
          state.teamDetails=action.payload;
      },
        logout:(state)=>{
            localStorage.clear();
            state.user=null;
            state.role=null;
            state.isAuthorized=false;
            state.token=null;
            state.contact=null;
            state.teamsWithContacts=null;
        },
        setIsAuthorized: (state, action: PayloadAction<boolean>) => {
          state.isAuthorized = action.payload;
        },
    }  ,
    extraReducers: (builder) => {
        builder.addCase(decodeToken.fulfilled, (state, action) => {
          state.user = action.payload;
          state.user = action.payload;
          if (action.payload && action.payload && action.payload.members) {
            const allTeams: ITeam[] = [];
            action.payload.members.forEach((member) => {
                if (member?.teams && Array.isArray(member.teams)) {
                    member.teams.forEach((team) => {
                        if (!allTeams.some((m) => m.id === team.id)) {
                            allTeams.push(team);
                        }
                    });
                }
            });
            state.team = allTeams;
        }
          state.contact = action.payload?.members ?? []; 
          state.isAuthorized = !isTokenExpired(state.token);
        if (action.payload !== null) {
            state.role = action.payload.role; 
          }                
        });
        builder.addCase(decodeToken.rejected, (state) => {
          state.user = null;
          state.role = null;
          state.isAuthorized = false;
          state.contact=null;
          state.team=null;
          state.teamsWithContacts=null;
        });
      },
})


export const selectAuth = (state:RootState)=>state.auth;
export const selectIsAuth = (state: RootState) => state.auth.isAuthorized;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectRole = (state: RootState) => state.auth.role;
export const selectContact = (state: RootState) => state.auth.contact;
export const selectTeam = (state: RootState) => state.auth.team;
export const selectContactDetails = (state: RootState) => state.auth.contactDetails;
export const selectTeamDetails = (state: RootState) => state.auth.teamDetails;
export const selectContactsByTeamId = (teamId: number | undefined) => (state: RootState) =>
  state.auth.contact?.filter((contact) =>
    contact?.teams && Array.isArray(contact.teams) && contact.teams.some((team) => team.id === teamId)
  ) ?? [];

  export const selectTeamsWithContacts = createSelector(
    [selectContact, selectTeam],
    (contacts, teams): ITeamWithContact[] => {
      const teamsWithContacts: ITeamWithContact[] = [];
  
      if (!contacts || !teams) {
        return teamsWithContacts;
      }
  
      teams.forEach(team => {
        const teamWithContacts: ITeamWithContact = {
          id: team.id ?? 0,
          name: team.name,
          description: team.description,
          avatar: team.avatar ?? null,
          members: [],
        };
  
        contacts.forEach(contact => {
          if (contact.teams && contact.teams.some(t => t.id === team.id)) {
            teamWithContacts.members.push({
              fullName: contact.fullName,
              phone: contact.phone,
              whatsapp: contact.whatsapp,
              email: contact.email,
              auth: contact.auth,
              endPoint: contact.endPoint,
              publicKey: contact.publicKey,
            });
          }
        });
  
        teamsWithContacts.push(teamWithContacts);
      });
  
      return teamsWithContacts;
    }
  );


export const {setUpdatedUser,setUser,logout,setIsAuthorized,addContact,addTeam,addContacts,
  setContactDetails,setTeamDetails,updateContact,setDeleteContact,setDeleteTeam,updateTeamAndContacts,
} = authSlice.actions

export default authSlice.reducer;