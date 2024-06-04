import React, { useState ,useEffect } from "react";
import './file.css';
import logo from './logo.png';
import { ReactComponent as TextIcon } from './svg/text.svg';
import { ReactComponent as ImageIcon } from './svg/image.svg';
import { ReactComponent as PdfIcon } from './svg/pdf.svg';
import { ReactComponent as WordIcon } from './svg/word.svg';
import { useNavigate, Link, useParams, useSearchParams } from 'react-router-dom';
import Workspace from './pages/Workspace';
import axios from 'axios';


const FileIcon = ({ type }) => {
  switch(type) {
    case 'application/pdf':
      return <PdfIcon width="50" height="50" />;
    case 'image/png':
      return <ImageIcon width="50" height="50" />;
    case 'text/plain':
      return <TextIcon  width="50" height="50"  />;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <WordIcon width="50" height="50" />;
    default:
      return <TextIcon width="50" height="50" />;
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
  const [currentEditingId, setCurrentEditingId] = useState(null); // 현재 수정 중인 파일 ID
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLook, setIsLook] = useState(false);
  const tags = ['빨', '주', '노', '초', '파', '남', '보'];
  const tagColors = {
    '빨': 'red',
    '주': 'orange',
    '노': 'yellow',
    '초': 'green',
    '파': 'blue',
    '남': 'navy',
    '보': 'purple',
  };

  const [workspace, setWorkspace] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const token = localStorage.getItem('accessToken');
  const [currentFolderId, setCurrentFolderId] = useState();
  const [currentFolderInfo, setCurrentFolderInfo] = useState();
  const [fileId, setFileId] = useState('');

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
      console.log(response.data);
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
    console.log(workspaceId)

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
      console.log(e)
}
  }

  const onDragStart = (e, tag) => {
    e.dataTransfer.setData('tag', tag);
  };

  // 파일 항목에 대한 드랍 이벤트 핸들러
const onDropa = (e, fileInfo) => {
    e.preventDefault();
    const tag = e.dataTransfer.getData('tag');

    // 파일에 드랍한 경우 fileInfo가 undefined이므로 분기 처리가 필요합니다.
    if (fileInfo) {
        // 파일 정보에 태그를 추가하는 로직
        const updatedSaveInfo = saveInfo.map(file => {
            if (file.id === fileInfo.id) {
                return { ...file, tags: [...(file.tags || []), tag] };
            }
            return file;
        });
        setSaveInfo(updatedSaveInfo);
    } else {
        // 기존의 파일을 드랍했을 때의 처리 로직
        const files = e.dataTransfer.files;
        confirmAndSetFileInfo(files);
    }
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

  const onClickSearchInput = async () => {
    
    const res = await getFolderInfo(userInput);
    setSearchLists(res);

  };

  const handleFileUpload = async (files) => {
    //파일의 업로드 기능

    console.log(files[0])

    const formData = new FormData();
    formData.append('request', JSON.stringify({
      workspaceId: selectedWorkspace,
      folderId: currentFolderId,
    }));
    formData.append('file', files[0]);

    console.log(formData)

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
      console.log(error)
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

  const handleDoubleClick = async (fileId, fileName) => {

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,  // 토큰 넣어주기
      },
    };
  
    // 파일을 더블클릭하여 실행하는 코드
    try {
      const response = await fetch(
        `http://125.250.17.196:1234/api/files/${fileId}`,
        { method: "GET", 
          headers: config.headers
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download'; // 파일 이름 설정
      document.body.appendChild(a);
      a.click();
      a.remove();
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
    console.log("hess")
    confirmAndSetFileInfo(files);
    
  };

  const filedelete =async(fileId) => {

    try {
      const response = await axios.get(`http://125.250.17.196:1234/api/workspace/${selectedWorkspace}/folders/${fileId}`, config);
      alert('파일이 성공적으로 삭제되었습니다.');
      getFolderInfo();
    } catch (error) {
      console.error('파일 불러오기 중 오류 발생:', error);
    }
  
  };


   const handleFileNameEdit = (id, newName) => {
    const updatedFiles = saveInfo.map(file => {
      if (file.id === id) {
        return { ...file, name: newName };
      }
      return file;
    });
    setSaveInfo(updatedFiles);
  };

 
  const openEditModal = (id) => {
    setIsEditing(true);
    setCurrentEditingId(id);
    const file = saveInfo.find(file => file.id === id);
    if (file) {
      setNewName(file.name);
    }
  };

  const [fileContent, setFileContent] = useState('');
  const [fileInfoName, setfileInfoName] = useState('');

  const lookFileInfo = async (fileId, fileName) => {

    setIsLook(true);
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,  // 토큰 넣어주기
      },
    };
    // 파일을 더블클릭하여 실행하는 코드
    try {
      const response = await fetch(
        `http://125.250.17.196:1234/api/files/${fileId}`,
        { method: "GET", 
          headers: config.headers
        }
      );
      const blob = await response.blob();
      const text = await blob.text();

      let fileData;
      try {
        fileData = JSON.parse(text);
      
        const { type, name, size, createdAt } = fileData.data; 
        setfileInfoName(name);
        setFileContent(`Type: ${type}\nName: ${name}\nSize: ${size}\nCreatedAt: ${createdAt}`);
      } catch (e) {
        setFileContent(text);
      }


    } catch (error) {
      console.error('파일을 여는 중 오류 발생:', error);
    }
  };
  
  const closeEditModal = () => {
    setIsEditing(false);
    setNewName('');
  };

  const handleSubmit = () => {
    handleFileNameEdit(currentEditingId, newName);
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

  const addFolder = () => {
   
    alert('폴더 추가 기능 구현');
  };

  const getFileUI = () => {
    console.log(currentFolderInfo)
    let parentFolderId = currentFolderInfo.data.parentFolderId
    let folders = currentFolderInfo.data.folders
    let files = currentFolderInfo.data.files

    return (
        <>
        <div className="grid-container2">
        {parentFolderId != null && <img src={logo} alt="로고" className="logo" onClick={() => changeCurrentFolder(parentFolderId)} />}
        {folders.length != 0 && (
          folders.map((folder, index) => (
            <img src={logo} alt="로고" className="logo" onClick={() => changeCurrentFolder(folder)} />
          ))
        )}
        {files.length != 0 && (
          files.map((fileInfo, index) => (
            <div className="grid-item" key={index} onDoubleClick={() => handleDoubleClick(fileInfo.id,fileInfo.name)}  onDrop={(e) => onDropa(e, fileInfo)} onDragOver={(e) => e.preventDefault()}>
            <div className="item-container">
              <FileIcon type={fileInfo.type} />
              <div>{fileInfo.name}</div>
              <div>{fileInfo.tag}</div>
            </div>
            <div className="btn-container">
            {/* <button className="file-delete" onClick={() => filedelete(fileInfo.id)}>
              삭제
            </button> */}
          <button className="file-name" onClick={() => openEditModal(fileInfo.id)}>수정</button>
          <button className="file-info" onClick={() => lookFileInfo(fileInfo.id,fileInfo.name)}>정보</button>
          </div>
          </div>
          ))
        )}
        

        {isEditing && (
        <div className="popup-container">
          <input type="text" value={newName} className="popup-input" onChange={(e) => setNewName(e.target.value)} />
          <button className="popup-button" onClick={handleSubmit} disabled={newName.length === 0}>제출</button>
          <button onClick={() => setIsEditing(false)}>닫기</button>
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

  const changeCurrentFolder = (id) => {
    setCurrentFolderId(id);
  }


  const handleButtonClick = async () => {
    try {
      const response = await fetch(`http://125.250.17.196:1234/api/files/${fileId}/pr`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
      
      const { message, data } = response.data;

      if (message === 'ok') {
        // message가 "ok"이면 /file/{fileId}/pr로 이동
        navigate(`/file/${fileId}/pr`);
      } else {
        // message가 "ok"가 아니면 console에 "메시지가 없습니다" 출력
        navigate(`/file/${fileId}/pr`);
        console.log('메시지가 없습니다');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
 
  return (

    <div className="app-container">
      <div className="left-panel">  
      {isLook && (
        <div className="popup-infoinfo">
          <div className="popup-info">
            
            <h2>{fileInfoName}</h2>
            <pre>{fileContent}</pre>
            <button onClick={() => setIsLook(false)}>닫기</button>
          </div>
        </div>
      )}
      
      <button onClick={() => popupOpenFunction(true)}>Select Workspace</button>
      <button onClick={() => window.location.href = '/workspace/{workspace}'}>워크스페이스 및 맴버 관리</button>
      <img src={logo} alt="로고" className="logo" />
      <p>
          <input
            onChange={getSearchData}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="검색어를 입력하세요"
          
          />
          
          {searchLists.map((fileInfo, index) => (
            <div className="grid-item" key={index} onDoubleClick={() => handleDoubleClick(fileInfo.id)}  onDrop={(e) => onDropa(e, fileInfo)} onDragOver={(e) => e.preventDefault()}>
            <div className="item-container">
              <FileIcon type={fileInfo.type} />
              <div>{fileInfo.name}</div>
              <div>{fileInfo.tag}</div>
            </div>
            <div className="btn-container">
            <button className="file-delete" onClick={() => filedelete(fileInfo.id)}>
              삭제
            </button>
          <button className="file-name" onClick={() => openEditModal(fileInfo.id)}>수정</button>
          </div>
          </div>
          ))}

          {/* {searchLists.map((fileInfo, index) => (
            <div key={index}>
              <p>{fileInfo.name} ({fileInfo.size} {fileInfo.type})</p>
            </div>
          ))} */}

      </p>
        <label className="file-button">
          <span>파일 추가</span>
          <input
            type="file"
            className="file"
            onChange={(e) => confirmAndSetFileInfo(e.target.files)}
          />
        </label>
        <button onClick={addFolder}>폴더 추가</button> 
          <div className="tags">
            {tags.map((tag, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => onDragStart(e, tag)}
                style={{ width: '5px', height: '5px', margin: '4px', padding: '5px',   backgroundColor: tagColors[tag], display: 'inline-block', borderRadius: '50%'}}
              >
          </div>
        ))}
        <button onClick={handleButtonClick}>파일 상세정보 확인</button>

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
      
      <div className="capacity-display">
        <div>
          <p>Total: {storage.total}</p>
          <p>Used: {storage.used}</p>
        </div>
      </div>
        
          {
            currentFolderInfo && (getFileUI())
          }
    
     </div>


     {showPreview && (
        <div className="preview-popup">
          <h2>File Preview</h2>
          
          {uploadedInfo.map((file, index) => (
            <div key={index}>
              <p>{file.name} ({file.size} {file.type})</p>
            </div>
          ))}   
                
          <button onClick={() => setShowPreview(false)}>Close</button>
          {<button onClick={handleSave}>저장하기</button>}  

        </div>
      )}

    </div>

    
  );
};

export default File;
