import React from 'react'
import { Link } from 'react-router-dom';
import Image from '../assets/image';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { AutoFixHigh, Flag, ManageSearch, MenuBook, School, VerifiedUser, Visibility } from '@mui/icons-material';
import { StarIcon } from 'lucide-react';

const Home = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => count < (testimonials.length - 1) ? prev + 1 : 0);
    }, 3000);
    console.log()
    return () => clearInterval(interval);
  }, [count])

  return (
    <main className='w-full bg-white min-h-screen h-auto pb-10'>
      {/* header nav */}
      <header className='w-[95%] max-w-6xl z-50 left-1/2 -translate-x-1/2 top-5 shadow-xs fixed px-5 py-2 bg-white/80 backdrop-blur-md rounded-md'>
        <div className='flex justify-between items-center '>
          <Link to="/">
            <img src={Image.Logo} className='w-16 h-16 object-fit' />
          </Link>
          <nav className="flex gap-4 items-center">
            <Link className='w-full p-2 text-center bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]' to="/login">
              Login
            </Link>
            <Link className='w-full p-2 text-center bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]' to="/register">
              Register
            </Link>
          </nav>
        </div>
      </header>
      {/* hero section */}
      <div className="w-full h-[70vh] relative overflow-hidden">
        <div className='w-full absolute p-4 left-0 bottom-0 z-30 bg-blue-200/70 backdrop-blur  h-full flex justify-center gap-1 text-center flex-col items-center'>
          <h1 className='text-2xl md:text-4xl font-semibold'>Welcome To School Pilot</h1>
          <p className='text-base md:text-lg text-gray-400'>a place where excellent mett's properity and greatness</p>
        </div>
        {/* <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={Image.intro} type="video/mp4" />
        </video> */}
        <div className='absolute z-20 -left-20 -top-20 bg-[#3b83f671] rounded-full w-96 h-96'></div>
        <div className='absolute z-20 -right-20 -bottom-20 bg-[#3b83f671] rounded-full w-96 h-96'></div>
      </div>

      {/* stats */}
      <div className='md:w-[95%] p-6 md:p-0 max-w-6xl mx-auto mt-20 gap-6 grid md:grid-cols-3 '>
        {
          statsArray.map((stat, index) => (
            <div key={index} className='border border-gray-100 rounded-md shadow-xs p-6 hover:-translate-y-2 transition duration-500'>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                  <p className='font-semibold text-sm'>
                    {stat.title}
                  </p>
                  <span className='p-1.5  bg-gray-200 rounded-md flex items-center'>
                    {stat.icon}
                  </span>
                </div>
                <span className='text-center font-bold text-2xl md:text-3xl'>
                  {stat.value}+
                </span>

                <p className='text-center text-sm'>
                  {stat.description}
                </p>
              </div>
            </div>))
        }
      </div>

      {/* about us */}
      <div className='w-[95%] h-auto max-w-6xl mt-20 mx-auto'>
        {/* <h1 className='text-center text-2xl md:text-3xl font-bold'>About Us</h1> */}
        <div className='grid gap-6 md:grid-cols-2'>
          <div className='flex flex-col gap-8 md:gap-10'>

            {visionMissionData.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-white flex flex-col gap-2 border border-gray-100 rounded-md shadow-sm  hover:-translate-y-2 transition-all duration-500"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center p-2 w-14 rounded-md bg-gray-200  shadow-md">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className='h-auto'>
            <ul className='flex flex-col gap-4'>
              {
                aboutSectionData.map((item, index) => (
                  <li className='bg-gray-50 p-4 rounded-md hover:translate-y-2 transition shadow-sm border border-gray-100 duration-500' key={index}>
                    <span className='flex items-center text-sm gap-2'>
                      <span className='p-1.5  bg-gray-200 rounded-md flex items-center'>{item.icon}</span>
                      <span>{item.title}</span>
                    </span>
                    <p className='text-xs mt-2'>{item.description}</p>
                  </li>
                ))
              }
            </ul>

          </div>
        </div>
      </div>

      {/* testimonials */}
      <div className='w-[95%] h-auto max-w-6xl mt-20 mx-auto'>
        <h1 className='text-center text-2xl md:text-3xl font-bold'>What Our client Says</h1>
        <div className={'w-full overflow-x-auto scrollbar-hide '}>
          <div className={`flex justify-start gap-6 pl-4 md:px-0 md:gap-4 py-6 transition-all ease-linear`}
            style={{
              transform: `translateX(-${window.innerWidth <= 768 ? Math.round(count * 100 / 1) : Math.round(count * 100 / 3)}%)`
            }}
          >
            {
              testimonials.map((item, _index) => (
                <div key={item.id} className="max-w-80 md:max-w-92.5 border shrink-0 border-gray-100 rounded-md shadow-xs p-6 mt-6 hover:-translate-y-2 transition duration-500">
                  <div>
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover" />
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                              <StarIcon className='w-4 h-4' />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm">{item.testimonial}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

    </main>
  )
}

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    testimonial:
      "I absolutely love the quality of the outfits. They make me feel confident and stylish every time.",
    image:
      "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Lee",
    testimonial:
      "The designs are unique and trendy. I always get compliments whenever I wear their pieces.",
    image:
      "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80",
    rating: 4,
  },
  {
    id: 3,
    name: "Amaka Okafor",
    testimonial:
      "Finally found a brand that perfectly blends comfort with elegance. My go-to fashion choice!",
    image:
      "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80",
    rating: 5,
  },
  {
    id: 4,
    name: "David Smith",
    testimonial:
      "Exceptional customer service and timeless designs. I’ll definitely be shopping here again.",
    image:
      "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80",
    rating: 4,
  },
  {
    id: 5,
    name: "Emily Carter",
    testimonial:
      "Every piece feels like it was designed just for me. The fit is perfect and the fabric is luxurious.",
    image:
      "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80",
    rating: 5,
  },
  {
    id: 6,
    name: "Daniel Adeyemi",
    testimonial:
      "I’ve never felt more stylish and comfortable at the same time. Truly a standout fashion brand.",
    image:
      "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80",
    rating: 5,
  },
];

const visionMissionData = [
  {
    title: "Our Vision",
    icon: <Visibility className='w-14 h-14' />, // MUI icon representing foresight and looking forward
    description: "To become the global standard for academic excellence, where every student has access to seamless research tools and the integrity of scholarship is preserved through innovative technology."
  },
  {
    title: "Our Mission",
    icon: <Flag className='w-14 h-14' />, // MUI icon representing a goal, objective, or milestone
    description: "Our mission is to empower the next generation of researchers by providing intuitive citation tools, comprehensive educational resources, and a supportive environment that simplifies the complexities of academic writing."
  },
  {
    title: "Our Mission",
    icon: <Flag className='w-14 h-14' />, // MUI icon representing a goal, objective, or milestone
    description: "Our mission is to empower the next generation of researchers by providing intuitive citation tools, comprehensive educational resources, and a supportive environment that simplifies the complexities of academic writing."
  }
];


const aboutSectionData = [
  {
    title: "Automated Precision",
    icon: <AutoFixHigh className='w-14 h-14' />, // Reflects the automated nature of citation generation
    description: "Instantly generate accurate citations for journals, websites, and books using our advanced algorithms updated for 2026 academic standards."
  },
  {
    title: "Diverse Style Support",
    icon: <MenuBook className='w-14 h-14' />, // Represents the various style manuals like APA, MLA, and Chicago
    description: "Access over 7,000 citation styles, including the latest APA 7th Edition and MLA 9th Edition, ensuring your bibliography meets specific institutional requirements."
  },
  {
    title: "Academic Integrity",
    icon: <VerifiedUser className='w-14 h-14' />, // Symbolizes trust and the prevention of plagiarism
    description: "Our tools are designed to help students and researchers properly credit original authors, fostering a culture of honesty and preventing unintentional plagiarism."
  },
  {
    title: "Research Simplified",
    icon: <ManageSearch className='w-14 h-14' />, // Suggests the ease of finding and managing source data
    description: "Simplify your research workflow by pulling metadata directly via URL, ISBN, or DOI, allowing you to focus more on writing and less on formatting."
  },
  {
    title: "Expert Resources",
    icon: <School className='w-14 h-14' />, // Represents the educational/institutional aspect of the site
    description: "Explore comprehensive guides on in-text citations, narrative styles, and how to cite non-traditional media like Generative AI and open educational resources (OER)."
  }
];

const statsArray = [
  {
    id: 'schools-count',
    title: 'Total Schools',
    value: 500,
    icon: <SchoolIcon className='w-14 h-14' />,
    description: 'Over 500 schools currently utilize this app for their management needs.'
  },
  {
    id: 'teachers-count',
    title: 'Active Teachers',
    value: 1000,
    icon: <PersonIcon className='w-14 h-14' />,
    description: '1,000 professional educators are delivering content through our platform.'
  },
  {
    id: 'students-count',
    title: 'Enrolled Students',
    value: 5000,
    icon: <GroupIcon className='w-14 h-14' />,
    description: 'Joining a community of 5,000 students learning and growing every day.'
  }
];
export default Home;