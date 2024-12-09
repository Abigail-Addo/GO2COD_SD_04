import { TextField } from '@mui/material'
import './App.css'
import * as React from 'react';
import { ChangeEvent, SyntheticEvent } from "react";
import Header from './components/Header'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { IoMdCopy } from "react-icons/io";
import { LuCopyCheck } from "react-icons/lu";
import { SlRefresh } from "react-icons/sl";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import { FaCircle } from "react-icons/fa";
import axios from 'axios';



const App = () => {
  const [password, setPassword] = React.useState("");
  const [passwordLength, setPasswordLength] = React.useState(12);
  const [strengthLevel, setStrengthLevel] = React.useState('strong');
  const [isCopied, setIsCopied] = React.useState(false);
  const [options, setOptions] = React.useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });


  // Function to handle reset button click
  const generatePassword = React.useCallback(async () => {
    try {
      const response = await axios.post("http://localhost:5000/generate-password", {
        length: passwordLength,
        options,
      });
      setPassword(response.data.password);
    } catch (error) {
      console.error("Error generating password:", error);
    }
  }, [passwordLength, options]);

  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Update strength level based on password length
  React.useEffect(() => {
    if (passwordLength < 6) {
      setStrengthLevel('very weak');
    } else if (passwordLength < 8) {
      setStrengthLevel('weak');
    } else if (passwordLength < 12) {
      setStrengthLevel('moderate');
    } else if (passwordLength < 16) {
      setStrengthLevel('strong');
    } else {
      setStrengthLevel('very strong');
    }
  }, [passwordLength]);

  // Handle slider change
  const handleSliderChange = (_event: Event | SyntheticEvent, value: number | number[]) => {
    setPasswordLength(typeof value === "number" ? value : 12);
  };

  // Handle checkbox change
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOptions((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  // handle copy
  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };


  return (
    <>
      <main className="h-full w-full overflow-y-scroll bg-[url('/assets/bg-image.jpg')] bg-center bg-cover bg-no-repeat" >
        <Header />
        <div className='container mx-auto'>
          <h1 className="text-3xl my-auto text-center py-6">Create strong passwords with Secure<span className='text-[#3F6FD5]'>Gen</span></h1>
        </div>


        {/* card */}
        <div className='container mx-auto my-auto py-16'>
          <div className='md:w-5/6 lg:w-3/4 p-10 bg-white shadow-2xl mx-auto rounded-md'>

            <div className=' grid lg:grid-cols-3 gap-4'>
              <TextField
                className='col-span-2'
                sx={{
                  width: '100%',
                  color: "#000"
                }}
                disabled
                id="outlined-disabled"
                value={password}
                variant="outlined"
              />
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" endIcon={<SlRefresh />} onClick={generatePassword} >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  startIcon={isCopied ? <LuCopyCheck /> : <IoMdCopy />}
                  onClick={handleCopy}
                >
                  {isCopied ? "Copied" : "Copy"}
                </Button>
              </Stack>
            </div>
            <p className="text-black flex items-center gap-2">
              <FaCircle
                className={`${strengthLevel === 'very weak'
                  ? 'fill-red-500'
                  : strengthLevel === 'weak'
                    ? 'fill-orange-500'
                    : strengthLevel === 'moderate'
                      ? 'fill-yellow-500'
                      : strengthLevel === 'strong'
                        ? 'fill-green-500'
                        : 'fill-green-700'
                  }`}
              />{' '}
              {strengthLevel}
            </p>

            <div className='grid lg:grid-cols-2 py-10'>
              <p className='text-black'>Password Length</p>
              <Slider
                aria-label="Password Length"
                defaultValue={12}
                value={passwordLength}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                step={1}
                min={3}
                max={20}
              />
            </div>

            <div className='text-black grid lg:grid-cols-4'>

              <FormControlLabel
                control={
                  <Checkbox
                    name="uppercase"
                    checked={options.uppercase}
                    onChange={handleCheckboxChange}
                  />
                }
                label="UpperCase" />
              <FormControlLabel
                control={
                  <Checkbox
                    name="lowercase"
                    checked={options.lowercase}
                    onChange={handleCheckboxChange}
                  />
                }
                label="LowerCase" />
              <FormControlLabel
                control={
                  <Checkbox
                    name="Numbers"
                    checked={options.numbers}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Numbers" />
              <FormControlLabel
                control={
                  <Checkbox
                    name="Special Characters"
                    checked={options.special}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Special Characters" />
            </div>
          </div>
        </div>

      </main >
    </>
  )
}

export default App
