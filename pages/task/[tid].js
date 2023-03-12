import { useRouter } from 'next/router'
import { FADE_DOWN_ANIMATION_VARIANTS } from '../../constants/animations'

import Balancer from "react-wrap-balancer";
import { useEffect, useState } from 'react';
import { ClipboardCopy, RefreshCw, Upload } from "lucide-react";
import { motion } from "framer-motion";
import Layout from '../../components/layout';
import io from "socket.io-client";
import { Download } from "lucide-react";
import { API_ENDPOINT } from '../../constants/strings';

export async function getTaskData(tid) {
    const res = await fetch(API_ENDPOINT + '/task/' + tid);
    const data = await res.json();
    return data;
}

export const getStaticPaths = async () => {


    return {
        paths: [],
        fallback: 'blocking'
    }
}

export async function getStaticProps({ params }) {
    const taskData = await getTaskData(params.tid);
    if (taskData.state == "404") {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            taskData,
        },
    };
}

const Success = () => {
    return <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
        <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 ">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <h2 className="text-sm font-normal">Success</h2>
        </div>
    </td>;
}
const Failed = () => {
    return <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
        <div className="inline-flex items-center px-3 py-1 text-red-500 rounded-full gap-x-2 bg-red-100/60 ">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="text-sm font-normal">Failed</h2>
        </div>
    </td>;
}
const Processing = () => {
    return <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
        <div className="inline-flex items-center px-3 py-1 text-gray-500 rounded-full gap-x-2 bg-gray-100/60 ">
            <svg width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></g></svg>
            <h2 className="text-sm font-normal">Processing</h2>
        </div>
    </td>;
}

const Post = ({ taskData }) => {
    const [state, setResult] = useState(taskData.state);
    const router = useRouter()
    var status = <Processing />;
    const { tid } = router.query;

    useEffect(() => {
        // const socket = io(API_ENDPOINT);

        // socket.on('task_finished', (data) => {
        //     console.log(data);
        //     if (data.id == tid.split('+')[0]) {
        //         setResult(data.state);

        //     }
        // });
        // socket.on('connect', () => {
        //     console.log('Connected to server');
        // });

        // return () => {
        //     socket.disconnect();
        // };
    }, []);



    if (['PENDING', 'RECEIVED', 'STARTED'].includes(state)) {
        status = <Processing />;
    }
    if (['SUCCESS'].includes(state)) {
        status = <Success />;
    }
    if (['FAILURE', 'REVOKED'].includes(state)) {
        status = <Failed />;
    }



    return <Layout>
        <motion.div
            className="max-w-2xl px-5 xl:px-0"
            initial="hidden"
            whileInView="show"
            animate="show"
            viewport={{ once: true }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: 0.15,
                    },
                },

            }}
        >
            <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
                Your Results
            </motion.h1>
            <motion.p
                className="mt-6 text-center text-gray-500 md:text-xl"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
                <Balancer ratio={0.6}>
                    Your video and subtitles(.SRT) will be stored in our servers for 24 hours. After that,
                    they will be deleted, make sure to download the file.
                </Balancer>
            </motion.p>

            <motion.div
                className=' w-full'
                variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
                <div className=' flex flex-row justify-center'>
                    <button
                        className="group mx-2  mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-500 hover:text-white"
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.reload()
                        }}
                    >
                        <RefreshCw className="h-5 w-5 text-gray-500 group-hover:text-white" />
                        <p>Refresh Task Status</p>
                    </button>
                    <button
                        className="group mx-2  mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-500 hover:text-white"
                        onClick={() => { navigator.clipboard.writeText(window.location.href) }}
                    >
                        <ClipboardCopy className="h-5 w-5 text-gray-500 group-hover:text-white" />
                        <p>Copy Result Link</p>
                    </button></div>
                <p className="mt-2 text-center text-xs text-gray-400">
                    <Balancer>Results usually take 2 to 3 minutes to process, you can copy the link and check again later on this link</Balancer>
                </p>
                <div className='flex flex-row items-center justify-center py-4'>
                    <div className="inline-block py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200  md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50 ">
                                    <tr>
                                        <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 ">
                                            <div className="flex items-center gap-x-3">
                                                <span>Task ID</span>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 ">
                                            Status
                                        </th>

                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 ">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 ">
                                    <tr>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-700  whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <span>{tid}</span>
                                            </div>
                                        </td>
                                        {
                                            status
                                        }
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-x-6">
                                                <a
                                                    href={API_ENDPOINT + `/download/${tid}`}
                                                    className={`text-blue-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none ${['SUCCESS'].includes(taskData.state) ? "" : "pointer-events-none"} flex flex-col items-center justify-center`}>
                                                    <Download className="h-5 w-5 text-gray-500" />
                                                    <p>Download</p>
                                                </a>

                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>



        </motion.div>
    </Layout>
}

export default Post;