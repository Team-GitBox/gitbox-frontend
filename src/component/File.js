import React, { useState ,useEffect } from "react";
import './file.css';
import logo from './logo.png';
import { useNavigate, Link, useParams, useSearchParams} from 'react-router-dom';
import Workspace from './pages/Workspace';
import axios from 'axios';
import { Gitgraph, templateExtend, TemplateName } from "@gitgraph/react";

const FileIcon = ({ type }) => {
  switch(type) {
    case 'PDF':
      return <img src="img/pdf.png" alt="PDF Icon" width="50" height="50"/>;
    case 'PNG':
      return <img src="img/image.png" alt="image Icon" width="50" height="50"/>;
    case 'TEXT':
      return <img src="img/txt.png" alt="txt Icon" width="50" height="50"/>;
    case 'DOCX':
      return <img src="img/word.png" alt="word Icon" width="50" height="50"/>;
    default:
     return <img src="img/txt.png" alt="text Icon" width="50" height="50"/>;
  }
};

const Logo = () => (
  <svg className="icon" x="0px" y="0px" viewBox="0 0 24 24">
    <path fill="transparent" d="M0,0h24v24H0V0z"/>
    <path fill="#000" d="M20.5,5.2l-1.4-1.7C18.9,3.2,18.5,3,18,3H6C5.5,3,5.1,3.2,4.8,3.5L3.5,5.2C3.2,5.6,3,6,3,6.5V19  c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6,20.8,5.6,20.5,5.2z M12,17.5L6.5,12H10v-2h4v2h3.5L12,17.5z M5.1,5l0.8-1h12l0.9,1  H5.1z"/>
  </svg>
);

const File = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();


  const [storage, setStorage] = useState({ total: 0, used: 0 });
 
  const [isActive, setActive] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState([]);
  const [uploadFileInfo, setUploadFileInfo] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saveInfo, setSaveInfo] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [searchLists, setSearchLists] = useState([]);
  const [tagLists, settagLists] = useState([]);
  const [deleteLists,setdeleteLists] = useState([]);
  const [currentEditingId, setCurrentEditingId] = useState(null); // 현재 수정 중인 파일 ID
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tagTag,settagTag] =useState(false);
  const [deleteDelete,setdeleteDelete] =useState(false);
  const [isFolderNameEditing, setIsFolderNameEditing] = useState(false);
  const [isFolderEditing, setIsFolderEditing] = useState(false);
  const[fixEdit,setfixEdit] = useState(false);
  const[searchEdit,setsearchEdit] = useState(false);
  const [isLook, setIsLook] = useState(false);
  const tags = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'NAVY', 'PURPLE'];
  const tagColors = {
    'RED': 'red',
    'GREEN': 'green',
    'YELLOW': 'yellow',
    'NAVY': 'navy',
    'BLUE': 'blue',
    'PURPLE': 'purple',
    'ORANGE' : 'orange'
  };

  const [workspace, setWorkspace] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const token = localStorage.getItem('accessToken');
  const [currentFolderId, setCurrentFolderId] = useState();
  const [currentFolderInfo, setCurrentFolderInfo] = useState();
  const[currentTagInfo,setcurrentTagInfo] = useState("undefined");
 
 
  const popupOpenFolder = async (folderId) => {
    setCurrentFolderId(folderId)
  }

  const popupOpenFunction = async (isOpen) => {
    if(isOpen) {
        try {
          const response = await axios.get('http://125.250.17.196:1234/api/workspace', config);
          setWorkspace(response.data.data);
          setIsPopupOpen(true);
        } catch (error) {
          console.error('파일 불러오기 중 오류 발생:', error);
        }
    }
  }
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}`, config);
        setCurrentFolderId(response.data.data.rootFolderId);
        

      } catch (error) {
        console.error('파일 불러오기 중 오류 발생:', error);
      }
    }

    fetchData();
    
  }, [selectedWorkspace]);

  const getFolderInfo = async () => 
    {
    try {
      const response = await axios.get(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}/folders/${currentFolderId}`, config);

      setCurrentFolderInfo(response.data);
  
    } catch (error) {
      console.error('파일 불러오기 중 오류 발생:', error);
    }
  }

  const getdeleteInfo = async () => 
    {
      
    try {
      
      setdeleteDelete(true);

     
      
       const response = await axios.get(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}/trash`,config)
      console.log("삭제 파일들",response.data);
       setdeleteLists(response.data.data);
       
     
      
    } catch (error) {
      console.error('파일 불러오기 중 오류 발생:', error);
    }
    
  }



  const getTagInfo = async (tag) => 
    {

    try {
      
      settagTag(true);
      const params = {
        workspaceId: selectedWorkspace,
        tag: tag,
      };
      
      const response = await axios.get(`http://125.250.17.196:1234/api/files/tag`, {
        params: params,
        ...config
      });
      
      console.log("잉",response.data.data)
      setcurrentTagInfo(response);
      settagLists(response.data.data);
      
    } catch (error) {
      console.error('파일 불러오기 중 오류 발생:', error);
    }
  }
  
  useEffect(() => {
    if(currentFolderId == undefined) return;
    
    getFolderInfo()


  }, [currentFolderId])

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,  // 토큰 넣어주기
    },
  };

   useEffect(() => {
    const workspaceId = searchParams.get('workspaceId');


    setSelectedWorkspace(workspaceId);
    setNewStorage(workspaceId);
    
  }, []);

  const setNewStorage = async (id) => {
    try {
      const storageData = await fetchStorageInfo(id);
      setStorage({
        total: storageData.data.maxStorage,
        used: storageData.data.usedStorage
      });
    } catch (e) {
    
}
  }

  const onDragStart = (e, tag) => {
    e.dataTransfer.setData('tag', tag);
  };


  const onDropa = async (e, fileId) => {
    e.preventDefault();
    const tag = e.dataTransfer.getData('tag');
    // 태그 값을 해당 파일에 저장하는 함수 호출
    await saveTagToFile(fileId, tag);
};

  const saveTagToFile = async (fileId, tag) => {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',  // 토큰 넣어주기
      },
    };

     try {
      const rrr = await axios.get(`http://125.250.17.196:1234/api/files/${fileId}`, config);
      const tagfilename = rrr.data.data.name;
      const requestBody = {
        name: tagfilename,
        tag: tag,
      };

         const response = await axios.patch(`http://125.250.17.196:1234/api/files/${fileId}` ,requestBody, config)
        

         
     } catch (error) {
         console.error('파일 업데이트 실패:', error);
     }

     getFolderInfo();
  };

  

  const handleLogout = () => {
           // 로그아웃 처리 로직을 구현합니다.
           sessionStorage.removeItem("token");
           sessionStorage.removeItem("email");
           navigate("/");
         };       


  const getSearchData = (e) => {
    setUserInput(e.target.value.toLowerCase());
  };

  const onClickSearchInput = async (e) => {
  
    
    const searchResults = currentFolderInfo.data.files.filter(file =>
      file.name.toLowerCase().includes(userInput.toLowerCase())
    );
    setSearchLists(searchResults);

  };

  const handleFileUpload = async (files) => {
    //파일의 업로드 기능

   
    const formData = new FormData();
    formData.append('request', JSON.stringify({
      workspaceId: selectedWorkspace,
      folderId: currentFolderId,
    }));
    formData.append('file', files[0]);

    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,  // 토큰 넣어주기
        'Content-Type': 'multipart/form-data',  // 데이터 형식 지정
      },
    };
  
    try {
      const response = await axios.post(`http://125.250.17.196:1234/api/files`, formData, config);
      
      if(response.status !== 200)
        {
          console.error("파일 업로드 실패")
        }
  
      // 업로드 후 파일 목록을 갱신합니다.
      getFolderInfo();
      //fetchFiles();
    } catch (error) {
     
    }
  };

  const fetchFiles = async () => {
    //파일 목록을 불러오는 코드
    try {
      const response = await fetch(
        "http://125.250.17.196:1234/api/files",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const data = await response.json();
      setSaveInfo(data);
    } catch (error) {
      console.error('파일 목록을 불러오는 중 오류 발생:', error);
    }
  };
  

  const handleDoubleClick = async (fileId) => {
    //파일을 더블클릭하여 실행하는 코드
    try {
      const response = await axios.get(`http://125.250.17.196:1234/api/files/${fileId}`, config)
     
      // window.location.href = response.data.data.url;
      window.open(response.data.data.url)
      
      
    } catch (error) {
      console.error('파일을 여는 중 오류 발생:', error);
    }
  };
  
  
   
  const handleSave = () => {
    if (window.confirm('파일을 저장하시겠습니까?'))
      {
         
        //setSaveInfo([...saveInfo,...uploadedInfo]);
        handleFileUpload(uploadFileInfo);
        setShowPreview(false)
      }
      
  };


  const handleDragStart = () => setActive(true);
  const handleDragEnd = () => setActive(false);
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const confirmAndSetFileInfo = (files) => {
    // 사용자가 '확인'을 클릭하면 파일 정보 저장   
      const filesInfo = Array.from(files).map(file => {
        const { name, size: byteSize, type } = file;
        const size = (byteSize / (1024 * 1024)).toFixed(2) + 'MB';
        return { name, size, type };
      });
      setUploadedInfo(filesInfo);
      setUploadFileInfo(files);
      
      setShowPreview(true); 
    
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setActive(false);

    const files = event.dataTransfer.files;
  
    confirmAndSetFileInfo(files);
    
  };



  const folderdelete =async(fileId) => {
  
    try {  
         const response = await axios.delete(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}/folders/${fileId}`,config)
         
     } catch (error) {
         console.error('파일 삭제 실패:', error);
     }

     getFolderInfo();
  };



  const filedelete =async(fileId) => {

    try {  
         const response = await axios.delete(`http://125.250.17.196:1234/api/files/${fileId}`, config)
         
     } catch (error) {
         console.error('파일 삭제 실패:', error);
     }

     getFolderInfo();
  };
  
 

  const realFiledelete =async(fileId) => {
    try {  
      console.log("찐 파일 삭제 아이디",fileId)
      const response = await axios.delete(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}/trash/${fileId}`, config)
      getdeleteInfo();
     } catch (error) {
         console.error('파일 삭제 실패:', error);
     }   
  };
  const fileRestore = async (fileId) => {    
    const config = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,  // 토큰 넣어주기
            'Content-Type': 'application/json',  // 데이터 형식 지정
        }
    };

    try {  
        const response = await fetch(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}/trash/${fileId}`, config);
        
        if (!response.ok) {
            throw new Error(`파일 복구 실패: ${response.status}`);
        }
        
    
    } catch (error) {
        console.error(error);
    }  
    getFolderInfo(); 
    getdeleteInfo();
};


  const handleFolderNameEdit = async (fileId, newName) => {

    try {
     
      const rrr = await axios.get(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}/folders/${fileId}`,config)
  
      const foldername = rrr.data.data.parentFolderId;
      const requestBody = {
        name: newName,
        parentFolderId: foldername,
      };
  
         const response = await axios.patch(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}/folders/${fileId}`,requestBody, config)
        
         
     } catch (error) {
         console.error('파일 업데이트 실패:', error);
     }
     getFolderInfo();
  };


   const handleFileNameEdit = async (fileId, newName) => {

    try {
      const rrr = await axios.get(`http://125.250.17.196:1234/api/files/${fileId}`, config);
      const tagfilename = rrr.data.data.tag;
      const requestBody = {
        name: newName,
        tag: tagfilename,
      };

         const response = await axios.patch(`http://125.250.17.196:1234/api/files/${fileId}` ,requestBody, config)
       
         
     } catch (error) {
         console.error('파일 업데이트 실패:', error);
     }
     getFolderInfo();
  };

 
  const openEditModal = (fileid) => {
    setIsEditing(true);
    setCurrentEditingId(fileid);
    const file = saveInfo.find(file => file.id === fileid);
    if (file) {
      setNewName(file.name);
    }
    
  };
  const openFolderEditModal = (fileid) => {
    setIsFolderNameEditing(true);
    setCurrentEditingId(fileid);
    const file = saveInfo.find(file => file.id === fileid);
    if (file) {
      setNewName(file.name);
    }
  };


  const [fileContent, setFileContent] = useState('');
  const [fileInfoName, setfileInfoName] = useState('');
  const [changeFile, setchangeFile] = useState('');
  
  const [elements, setElements] = useState([]);

  let first = "firstcircle";
 
  const [fileInfoId, setfileInfoId] = useState('');
  function removeLastElement(array) {
    array.pop();
  }

  const lookFileInfo = async (fileId) => {

    try {

      const response = await axios.get(`http://125.250.17.196:1234/api/files/${fileId}`, config);

      const tree = await axios.get(`http://125.250.17.196:1234/api/files/${fileId}/tree`, config);
      
      
       if(response.data.data.pullRequestId==null)
         {
          setIsLook(true);

          let fileData = response.data;
    
          try {
            
            const { type, name, size, createdAt } = fileData.data; 
            setfileInfoName(name); 
            setfileInfoId(fileId);
            setFileContent(`Type: ${type}\nSize: ${size}\nCreatedAt: ${createdAt}`);
          } catch (e) {
            setFileContent(JSON.stringify(fileData)); // JSON.parse 대신에 JSON.stringify를 사용하여 객체를 문자열로 변환합니다.
          }
          console.log("나 트리요",tree.data.data)
          
          const approveArray = [];
          const fileName = [];

          changeFile.map((file) => {

            const isCurrentGreen = file.status === "APPROVED";

            approveArray.push(isCurrentGreen == 'APPROVED');
            fileName.push(files.name);
          })

          const files = tree.data.data;
          setchangeFile(files)

          console.log ("파일 트리 정렬",changeFile);
        
          // const greengit = [];
          // const redgit = [];
          // const connectLinegit = [];
      
          const myTemplate = templateExtend(TemplateName.Metro, {
            branch: {
              label: {
                font: "normal 12pt Arial", // 브랜치 레이블의 폰트 크기 조정
                display: false,
              },
            },
            commit: {
              message: {
                displayAuthor: false, // Author를 표시하지 않음
                displayHash: false,
                font: "normal 10pt Arial", // 커밋 메시지의 폰트 크기 조정
              },
              dot: {
                size: 10, // 커밋 점의 크기 조정
              },
            },
          });

          setElements(
            <div className="gitContainer">
              <Gitgraph options={{ template: myTemplate }}>
                {(gitgraph) => {
                  const master = gitgraph.branch("master");
                  let currentBranch = master;

                  for (let i = 0; i < fileName.length; i++) {
                    const fileName1 = fileName[i];
                    const isApproved = approveArray[i];

                    if (isApproved) {
                      currentBranch.commit(fileName1);
                    } else {
                      currentBranch = gitgraph.branch(fileName1);
                      currentBranch.commit(fileName1);
                    }
                  }
                }}
              </Gitgraph>
            </div>
          );
          
          }
        
      else
        {
          navigate(`/pull-request/${response.data.data.pullRequestId}`);
        }
      


    } catch (error) {
      console.error('파일을 여는 중 오류 발생:', error);
    }
  };


 
  const closeEditModal = () => {
    setIsEditing(false);
    setIsFolderEditing(false);
    setIsFolderNameEditing(false);
    setNewName('');
  };

  const handleSubmit = () => {
    handleFileNameEdit(currentEditingId, newName);
    closeEditModal();
  };
  const handleSubmitFolder = () => {
    addFolder(newName);
    closeEditModal();
  };
  const handleSubmitAdd = () => {
    handleFolderNameEdit(currentEditingId, newName);
    closeEditModal();
  };


  const WorkspacePopup = ({ onSelect, onClose }) => {
      
    return (
      <div className="popup">
        <div className="popup-inner">
          <h2>Select a Workspace</h2>
          {workspace.map((workspace) => (
            <h1 key={workspace.workspaceId} onClick={() => onSelect(workspace.workspaceId)}>
              {workspace.workspaceName}
            </h1>
          ))}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };



  const handleSelectWorkspace = (id) => {
    setIsPopupOpen(false);
    setSearchParams({workspaceId: id});
    setSelectedWorkspace(id);
    setNewStorage(id);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClickSearchInput();
      setsearchEdit(true);
    }
  };

  const fetchStorageInfo = async (workspaceId) => {
     // 로컬 스토리지에서 accessToken을 가져옵니다.
  
    if (!token) {
      console.error('No accessToken in localStorage');
      return { total: 0, used: 0 }; // 토큰이 없으면 기본값 반환
    }
  
    try {
      const response = await fetch(`http://125.250.17.196:1234/api/workspace/${workspaceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 요청 헤더에 토큰을 포함합니다.
        },
      });
  
      if (!response.ok) {
        throw new Error('용량 정보를 불러오는 데 실패했습니다.');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('용량 정보를 가져오는 중 오류 발생:', error);
      return { total: 0, used: 0 }; // 오류 발생 시 기본값 반환
    }
  };

const addFolder = async (newName) => {
  setIsFolderEditing(true);

  try{
      const aa = await axios.get(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}/folders/${currentFolderId}`, config); 
      const parentfolderid = aa.data.data.id;
    
     
      const data = {
        name: newName,
        parentFolderId: parentfolderid,  // 현재 폴더의 ID를 부모 폴더 ID로 사용
      };
    
      try {
        const response = await axios.post(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}/folders`, data, config);
    
        if (response.status !== 200) {
          console.error("폴더 추가 실패");
          return;
        }
        // 폴더 추가 후 폴더 목록을 갱신합니다.
        getFolderInfo();
      } catch (error) {
    
      }
    
    } catch (error) {
      console.error('파일 불러오기 중 오류 발생:', error);
    }  
  
 
};
    const getTagUI = () => {
     
      //let files = currentTagInfo.data.data
      // console.log("태그",files)
     

      return (  
        <div className="grid-container2">
         
        {tagTag && (
        <div className="preview-popup" style = {{paddingTop: '0px'}}>  
        {tagLists.map((fileInfo, index) => (
          <div className="grid-item" key={index} onDoubleClick={() => handleDoubleClick(fileInfo.id,fileInfo.name)}  onDrop={(e) => onDropa(e, fileInfo.id)} onDragOver={(e) => e.preventDefault()} style={{marginTop: '20px'}}>
          <button className="file-delete" onClick={() => filedelete(fileInfo.id)}></button>
          <div className="item-container">
            <div className="item-contain">
              <button className="con" onClick={() => lookFileInfo(fileInfo.id)}>
              <FileIcon className='icon' type={fileInfo.type} />
              </button>
              <div className="item-con">
              <div style={{width: '5px', height: '5px', margin: '4px', padding: '5px',   backgroundColor: tagColors[fileInfo.tag], display: 'flex', borderRadius: '50%', flexDirection: 'row', textAlign: 'center'}}></div>
                <div style={{margin: '0px 5px 0px 5px'}}>{fileInfo.name}</div>
                  <button className="file-name" onClick={() => openEditModal(fileInfo.id)}></button>
                
              </div>
          </div>
        </div>
      </div>
        
        ))}
        
        <button onClick={() => settagTag(false)} style={{marginTop: '20px', marginBottom: '0px'}}>Close</button>
    </div>
      
        )}
         </div>
      )
    }
   
    
 
  const getFileUI = () => {
    console.log(currentFolderInfo)
    let parentFolderId = currentFolderInfo.data.parentFolderId
    let folders = currentFolderInfo.data.folders
    let files = currentFolderInfo.data.files
    

    return (
        <>
        <div className="grid-container2">
        {parentFolderId != null &&(
            <div className="grid-item">
            <img 
              src="img/back.png" 
              alt="folder" 
              className="folder" 
              onDoubleClick={() => changeCurrentFolder(parentFolderId)} 
            />
            <div className="parentfolder-name">턴라잇</div>
          </div>
        )}
        {folders.length != 0 && (
          folders.map((folder, index) => (
            <div className="grid-item" key={index} onDoubleClick={() =>  popupOpenFolder(folder.id)} >
              <button className="file-delete" onClick={() => folderdelete(folder.id)}></button>
              <div className='item-container'>
                <div className="item-contain">
                <div style={{marginBottom: '10px'}} className='con'>
            <img src="img/folder.png" alt="folder" className="folder" />  
            </div>
            <div class='item-con'>
              <div style={{marginRight: '5px'}}>{folder.name}</div>
              <button className="file-name" onClick={() => openFolderEditModal(folder.id)}></button>
              </div>
              </div>
              </div>
            </div>
          ))
        )}
        {files.length != 0 && ( //main
          files.map((fileInfo, index) => (
            
            <div className="grid-item" key={index} onDoubleClick={() => handleDoubleClick(fileInfo.id,fileInfo.name)}  onDrop={(e) => onDropa(e, fileInfo.id)} onDragOver={(e) => e.preventDefault()}>
              <button className="file-delete" onClick={() => filedelete(fileInfo.id)}></button>
              <div className="item-container">
                <div className="item-contain">
                <button className="con" onClick={() => lookFileInfo(fileInfo.id)}>
                <FileIcon className='icon' type={fileInfo.type} />
                </button>
                  <div className="item-con">
                  <div style={{width: '5px', height: '5px', margin: '4px', padding: '5px',   backgroundColor: tagColors[fileInfo.tag], display: 'flex', borderRadius: '50%', flexDirection: 'row', textAlign: 'center'}}></div>
                    <div style={{marginLeft: '5px', marginRight: '5px'}}>{fileInfo.name}</div>
                      <button className="file-name" onClick={() => openEditModal(fileInfo.id)}></button>
                    
                  </div>
              </div>
            </div>
          </div>
          ))
        )}
        {isFolderEditing && (
        <div className="popup-container">
          <input type="text" value={newName} className="popup-input" onChange={(e) => setNewName(e.target.value)} />
          <div className='p'>
            <button className="popup-button" onClick={handleSubmitFolder} disabled={newName.length === 0}>이름 작성완료</button>
            <button className="btn" onClick={() => setIsFolderEditing(false)}>닫기</button>
          </div>
        </div>)}

        
        {isEditing && (
        <div className="popup-container">
          <input type="text" value={newName} className="popup-input" onChange={(e) => setNewName(e.target.value)} />
          <div className='p'>
          <button className="popup-button" onClick={handleSubmit} disabled={newName.length === 0}>수정완료</button>
          <button className="btn" onClick={() => setIsEditing(false)}>닫기</button>
          </div>
        </div>
      )}
      {isFolderNameEditing && (
        <div className="popup-container">
          <input type="text" value={newName} className="popup-input" onChange={(e) => setNewName(e.target.value)} />
          <div className="p">
          <button className="popup-button" onClick={handleSubmitAdd} disabled={newName.length === 0}>수정완료</button>
          <button className="btn" onClick={() => setIsFolderNameEditing(false)}>닫기</button>
          </div>
        </div>
      )}
       {deleteDelete && (
        <div style={{paddingTop: '0px'}} className="preview-popup">  
        {deleteLists.map((fileInfo, index) => (

            <div style={{marginTop: '20px'}}className="grid-item" key={index} onDoubleClick={() => handleDoubleClick(fileInfo.id,fileInfo.name)}  onDrop={(e) => onDropa(e, fileInfo.id)} onDragOver={(e) => e.preventDefault()}>
              <button className="file-delete" onClick={() => realFiledelete(fileInfo.id)}></button>
              <button className="file-restore" onClick={() => fileRestore(fileInfo.id)}>복구</button>
              <div className="item-container">
                <div className="item-contain">
                  <div className="con">
                <FileIcon className='icon' type={fileInfo.type} />
                </div>
                  <div className="item-con">
                    
                    <div>{fileInfo.name}</div>
                      <div>{fileInfo.tag}</div>
                    
                  </div>
                  <div className="btn-container">
                  
                </div>
              </div>
             
            </div>
          </div>

        ))}
        
        <button onClick={() => setdeleteDelete(false)} style={{marginTop: '20px', marginBottom: '0px'}}>Close</button>
        </div>
      
        )}
      
      </div>

        <label
          className={`preview${isActive ? ' active' : ''} transparent-drop-zone`}
          onDragEnter={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragEnd}
          onDrop={handleDrop}
        >
        </label>
      </>
  
      
    )
  }

  const changeCurrentFolder = async (id) => {
 
    setCurrentFolderId(id);
  }
  const handleWorkspaceBtn = () => {
    const workspaceId = searchParams.get('workspaceId');
    window.location.href = `/Workspace/${selectedWorkspace}`
  };

  const handleNewVirsionBtn = async (fileInfoId) => {
    window.location.href = `/files/${fileInfoId}/add-pr`
  };
 
  const usedPercentage = (storage.used / storage.total) * 100;

  const bytesToSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    const size = Math.round(bytes / Math.pow(1024, i));
    const unit = sizes[i];
    
    return { size, unit };
  };

  const total = bytesToSize(storage.total);
  const used = bytesToSize(storage.used);

  const myTemplate = templateExtend(TemplateName.Metro, {
    branch: {
      label: {
        font: "normal 12pt Arial", // 브랜치 레이블의 폰트 크기 조정
        display: false,
      },
    },
    commit: {
      message: {
        displayAuthor: false, // Author를 표시하지 않음
        displayHash: false,
        font: "normal 10pt Arial", // 커밋 메시지의 폰트 크기 조정
      },
      dot: {
        size: 10, // 커밋 점의 크기 조정
      },
    },
  });

  return (

    <div className="app-container">
      <div className="left-panel">  
      {isLook && (
        <div className="popup-infoinfo">
          <div className="popup-info">
          <FileIcon type={fileInfoName} />
            <div>{fileInfoName}</div>
            <pre>{fileContent}</pre>
            <div>{elements}</div>
           
            <button onClick={() => setIsLook(false)}>닫기</button>
            <button onClick={() => handleNewVirsionBtn(fileInfoId)}>새로운 버전 업로드</button>
          </div>
        </div>
      )} 
      
      <button className="trash" onClick={() => getdeleteInfo()}></button>
      <button onClick={() => popupOpenFunction(true)}><img src="img/logo.png" style={{position:"absolute",width: '50px', left:'19px', top:'56px'}}/> Select Workspace</button>
      <button onClick={() => handleWorkspaceBtn()}><img src="img/logo.png" style={{position:"absolute",width: '50px', left:'50px', top:'96px'}}/>Settings</button>
   
      <p>
          <input
            onChange={getSearchData}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="검색어를 입력하세요"
          
          />
        
      </p>
        <label className="file-button">
          <span>파일 추가</span>
          <input
            type="file"
            className="file"
            onChange={(e) => confirmAndSetFileInfo(e.target.files)}
          />
        </label>
        <div>
          <button onClick={() => addFolder()}>폴더 추가</button> 
        </div>
          <div style={{display: 'flex', flexDirection: 'row'}}className='t'>
          <div className="tags">
            {tags.map((tag, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => onDragStart(e, tag)}
                style={{ width: '5px', height: '5px', margin: '15px 5px 15px 5px', padding: '5px',   backgroundColor: tagColors[tag], display: 'flex', borderRadius: '50%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
              >
          </div>
        ))}
        </div>
        <div className="tag-circle">
        <button className= "tag-button" onClick={() => getTagInfo("RED")}>RED</button>
        <button className= "tag-button" onClick={() => getTagInfo("ORANGE")}>ORANGE</button>
        <button className= "tag-button" onClick={() => getTagInfo("YELLOW")}>YELLOW</button>
        <button className= "tag-button" onClick={() => getTagInfo("GREEN")}>GREEN</button>
        <button className= "tag-button" onClick={() => getTagInfo("BLUE")}>BLUE</button>
        <button className= "tag-button" onClick={() => getTagInfo("NAVY")}>NAVY</button>
        <button className= "tag-button" onClick={() => getTagInfo("PURPLE")}>PURPLE</button>
        </div>
        </div>

      <button className="user-logout-btn" onClick={handleLogout}>
                로그아웃   
           </button>
      </div>

      <div className="right-panel">
      {
        isPopupOpen && (
        <WorkspacePopup
          onSelect={handleSelectWorkspace}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
      
          <div className="capacity-display">Used : {used.size}{used.unit} / Total : 10GB
          <div className="capacity-display2" style={{
            width: `${usedPercentage}%`, backgroundColor:'#3593FF' }}>
          <div className="capacity-text">
          </div>
        </div>
        </div>
        
          {
            currentFolderInfo && (currentTagInfo != undefined) && (getFileUI())
          }
          {
            currentTagInfo && (getTagUI())
          }
    
     </div>


     {showPreview && (
        <div className="preview-popup">
          <h2 style={{marginTop: '20px', marginBottom: '20px'}}>File Preview</h2>
          
          {uploadedInfo.map((file, index) => (
            <div key={index}>
              <p style={{textAlign: 'center'}}>{file.name} ({file.size} {file.type})</p>
            </div>
          ))}   
                
          <button style={{marginBottom: '0px', marginTop: '20px'}} onClick={() => setShowPreview(false)}>Close</button>
          {<button style={{marginBottom: '0px', marginTop: '20px'}} onClick={handleSave}>저장하기</button>}  

        </div>
      )}
       {searchEdit && (
          <div className="preview-popup" style={{paddingTop: '0px'}}>  
              {searchLists.map((fileInfo, index) => (
                <div className="grid-item" style={{marginTop:'20px'}}key={index} onDoubleClick={() => handleDoubleClick(fileInfo.id,fileInfo.name)}  onDrop={(e) => onDropa(e, fileInfo.id)} onDragOver={(e) => e.preventDefault()}>
                <button className="file-delete" onClick={() => filedelete(fileInfo.id)}></button>
                <div className="item-container">
                  <div className="item-contain">
                    <div className="con">
                  <FileIcon className='icon' type={fileInfo.type} />
                  </div>
                    <div className="item-con">
                    <div style={{width: '5px', height: '5px', margin: '4px', padding: '5px',   backgroundColor: tagColors[fileInfo.tag], display: 'flex', borderRadius: '50%', flexDirection: 'row', textAlign: 'center'}}></div>
                    
                      <div style={{marginRight: '5px', marginLeft: '5px'}}>{fileInfo.name}</div>
                        <button className="file-name" onClick={() => openEditModal(fileInfo.id)}></button>
                      
                    </div>
                    <div className="btn-container">
                    
                  </div>
                </div>
                <button className="file-info" onClick={() => lookFileInfo(fileInfo.id)}></button>
              </div>
            </div>
              
              ))}
              
              <button onClick={() => setsearchEdit(false)} style={{marginBottom: '0px', marginTop: '20px'}}>Close</button>
          </div>
        )}

      {fixEdit && (
        
        <div className="preview-popup">  
        <label className="file-button">
          <span>파일 추가</span>
          <input
            type="file"
            className="file"
            onChange={(e) => confirmAndSetFileInfo(e.target.files)}
          />
          
        </label>
            <button onClick={() => setfixEdit(false)}>Close</button>
        </div>
      )}

       
    </div>

    
  );
};

export default File;