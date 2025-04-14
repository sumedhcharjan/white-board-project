import React, { useState } from 'react'
import Participants from '../../pages/Participants';

const OnlineControls = ({isHost,hostid,participants}) => {

    const [showparticipants, setshowparticipants] = useState(false);

    const onClose=(params) => {
        setshowparticipants(false);
    }
    return (
        <>
            <div className="bg-[#1B4242] p-4 flex justify-between w-full h-fit rounded-lg  overflow-y-auto">
                <h3 className="font-semibold mb-2">chat</h3>
                <h3 className="font-semibold mb-2">mic</h3>
                <button onClick={()=>setshowparticipants(prev=>!prev)} className="font-semibold mb-2">Participants</button>
                {
                    showparticipants && (
                        <Participants
                        participants={participants}
                        onClose={onClose}
                        isHost={isHost}
                        hostid={hostid}
                        ></Participants>
                    )
                }
            </div>
        </>
    )
}

export default OnlineControls