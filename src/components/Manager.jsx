import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        console.log(passwords)
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text);
    }

    const showPassword = () => {
        passwordRef.current.type = "text";
        console.log(ref.current.src);
        if (ref.current.src.includes("/icons/eyecross.png")) {

            ref.current.src = "/icons/eye.png"
            passwordRef.current.type = "text";
        } else {

            ref.current.src = "/icons/eyecross.png"
            passwordRef.current.type = "password";
        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
            await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })

            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]));
            // console.log([...passwordArray, form]);
            setForm({ site: "", username: "", password: "" });
            toast('Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else {
            toast('Error: Password not saved!');
        }
    }

    const deletePassword = async (id) => {
        let c = confirm("Are you sure you want to delete this password?");
        if (c) {
            const res = await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                setPasswordArray(passwordArray.filter(item => item.id !== id));
                toast('Password Deleted!');
            } else {
                toast('Delete failed!');
            }
        }
    };


    const editPassword = (id) => {

        console.log("Editing password with id ", id);
        setForm({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id));
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="dark"
                transition="Bounce"
            />
            <div className='p-3  rounded-lg shadow-lg px-2  md:myContainer min-h-[76.2vh]'>
                <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#22c55e_100%)]"></div>
                <h1 className='text-4xl text font-bold text-center'><span className='text-[#0000FF]'>&lt;</span>
                    <span>Pass</span>

                    <span className='text-[#0000FF]'>Op/&gt;</span></h1>
                <p className='text-[#0000FF] text-lg text-center'>Your own Password Manager</p>
                <div className='text-black flex flex-col p-4 gap-8 items-center mt-8 relative'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter Website Url' className='rounded-full  border border-[#0000FF] w-full p-4 py-1' type="text" name='site' id='site' />
                    <div className='flex flex-col md:flex-row w-full gap-8 mx-auto justify-between mt-4'>
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full  border border-[#0000FF] w-full p-4 py-1' type="text" name='username' id='username' />
                        <div className="relative">

                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full  border border-[#0000FF] w-full p-4 py-1' type="text" name='password' id='password' />
                            <span className='absolute right-[1px] top-[50%] translate-y-[-50%] cursor-pointer ' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="./icons/eye.png" alt="" />
                            </span>
                        </div>
                    </div>


                </div>

                <button onClick={savePassword} className='bg-[#ADD8E6] text-black rounded-full px-8 py-2 flex gap-2 mx-auto mt-4 hover:bg-[#0000CC] hover:scale-105 duration-300 w-fit border border-[#0000FF]'>
                    <lord-icon
                        src="https://cdn.lordicon.com/vjgknpfx.json"
                        trigger="hover">
                    </lord-icon>
                    Save</button>
                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <p className='text-gray-600'>No passwords saved yet.</p>}
                    {passwordArray.length != 0 &&
                        <table className="table-auto w-full text-left border border-gray-300 mt-4 bg-green-100 rounded-md overflow-hidden mb-10">
                            <thead className='bg-green-300'>
                                <tr>
                                    <th className='py-2 text-center'>Site</th>
                                    <th className='py-2 text-center'>Userame</th>
                                    <th className='py-2 text-center'>Password</th>
                                    <th className='py-2 text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-300 bg-green-50'>
                                {passwordArray.map((item, index) => (
                                    <tr key={index}>
                                        <td className='flex items-center justify-center py-2 border border-white text-center '><a href={item.site} target='_blank'>{item.site}</a>
                                            <div className=' '>
                                                <div onClick={() => { copyText(item.site) }}>
                                                    <video
                                                        src="/icons/copy.mp4"
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-6 h-6 cursor-pointer ml-2"
                                                        onMouseEnter={(e) => e.target.play()}
                                                        onMouseLeave={(e) => {
                                                            e.target.pause();
                                                            e.target.currentTime = 0;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className=' py-2 border border-white text-center '>
                                            <div className='flex justify-center items-center'>
                                                <span>{item.username}</span>
                                                <div onClick={() => { copyText(item.username) }}>
                                                    <video
                                                        src="/icons/copy.mp4"
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-6 h-6 cursor-pointer ml-2"
                                                        onMouseEnter={(e) => e.target.play()}
                                                        onMouseLeave={(e) => {
                                                            e.target.pause();
                                                            e.target.currentTime = 0;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className=' py-2 border border-white text-center '>
                                            <div className='flex justify-center items-center'>
                                                <span>{"*".repeat(item.password.length)}</span>
                                                <div onClick={() => { copyText(item.password) }}>
                                                    <video
                                                        src="/icons/copy.mp4"
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-6 h-6 cursor-pointer ml-2"
                                                        onMouseEnter={(e) => e.target.play()}
                                                        onMouseLeave={(e) => {
                                                            e.target.pause();
                                                            e.target.currentTime = 0;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className=' py-2 border border-white text-center '>
                                            <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/exymduqj.json"
                                                    trigger="hover"
                                                    colors="primary:#000000,secondary:#000000"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/jzinekkv.json"
                                                    trigger="hover"
                                                    colors="primary:#000000,secondary:#000000"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>}
                </div>
            </div>
        </>
    )
}

export default Manager


