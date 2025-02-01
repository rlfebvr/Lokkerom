
# Lokkeroom

Lokkeroom is an api to make different lokker room( a group chat) in which you can have a coach that is the admin of it and a coach can add player to it.

##

### Revelant skill used/learned

- Routing
- SQL
- API
- JWT

## A coach can:  
- Create a lobby  
- Add a player to a lobby

## Everyone can:  
- Send a message to a lobby they are part of
- Edit their message
- Get the messages from lobby they are part of

## API
In the request.rest file you can see how to use the API and test it from there with a rest client.
Tokens are provided in the env file for testing


### Returned result

#### user/login   

{  
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjo4LCJpYXQiOjE3Mzg0NDgxNzh9.SJmtaVc56y5OsgveYfpbEd1qmOoDNnuff-fRtdALu1o",  
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9.OA.f7SiPeyfUSCNs-y-Dxz8SrMBxUzKjwBVUDkVTYvMgwE"  
}

#### user/token

{  
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiOCIsImlhdCI6MTczODQ0ODI3NSwiZXhwIjoxNzM4NDQ4MzA1fQ.WBv7QEFphuwyV4wA2R2ahBFdsX0IEB8nzN8GAhpAx2Y"
}

#### lobby/get-message?page=1&limit=2

{  
  "message": "Page sent successfully",  
  "stock": [  
    {  
      "id": 1,  
      "user_id": 6,  
      "lobby_id": 1,  
      "message": "Something to say",  
      "sentAt": "2024-10-18T09:39:47.000Z"  
    },  
    {  
    "id": 2,  
      "user_id": 2,  
      "lobby_id": 1,  
      "message": "Nothing coach",  
      "sentAt": "2024-10-18T09:41:16.000Z"  
    }  
  ]  
}

#### all

{  
    "message": "Either an error message or done successfully"   
}