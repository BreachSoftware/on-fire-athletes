import { Flex, Text, Button } from "@chakra-ui/react";
import "@fontsource/water-brush";
import "@fontsource/barlow-condensed";
import { CSSProperties } from "styled-components";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";

const fadeTimer = 500;
const intervalTimer = 2000;

/**
 * This is the header component
 * @returns The header component.
 */
export function ForTheNewEra() {

	// What our header can be
	const textOptions = useMemo(() => {
		return [ "Capture", "Create", "Customize" ];
	}, []);

	const [ currentText, setCurrentText ] = useState(textOptions[0]);
	const [ opacity, setOpacity ] = useState(1);

	const outlineStyle: CSSProperties = {
		WebkitTextStrokeWidth: "2px",
		WebkitTextStrokeColor: "white",
	};

	const router = useRouter();
	const [ createButtonLoading, setCreateButtonLoading ] = useState(false);
	const [ collectButtonLoading, setCollectButtonLoading ] = useState(false);
	const [ progressIndex, setProgressIndex ] = useState(0);

	// Change the text every 3 seconds
	useEffect(() => {
		const intervalId = setInterval(() => {
			setOpacity(0);
			setProgressIndex((progressIndex + 1) % 3);

			// Wait a bit before changing the text
			setTimeout(() => {
				setCurrentText((prevText) => {
					const currentIndex = textOptions.indexOf(prevText);
					const nextIndex = (currentIndex + 1) % textOptions.length;
					return textOptions[nextIndex];
				});
				setOpacity(1);
			}, fadeTimer);

		}, intervalTimer);

		return () => {
			return clearInterval(intervalId);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentText ]);

	const textFlashStyle = {
		transition: `opacity ${fadeTimer / 2000}s ease-in-out`,
		opacity: opacity,
	};

	return (
		<>
			<Flex
				flexDir="column"
				maxW="1800px"
				h="100%"
				alignSelf="left"
				justifyContent="center"
				px="100px"
			>
				<Flex flexDir="column">
					<Text
						fontFamily="Brotherhood"
						fontSize="125px"
						color="green.100"
						textShadow="0px 10px 6px #00000084"
						userSelect="none"
						marginBottom="-98px"
						marginLeft="6px"
						zIndex={2}
						style={textFlashStyle}
					>
						{currentText}
					</Text>
					<Text
						fontFamily="barlow Condensed"
						fontSize="100px"
						color="white"
						fontWeight={700}
						letterSpacing="5px"
						userSelect="none"
						zIndex={1}
					>
						YOUR MOMENT
					</Text>

					{/* Divider */}
					<Flex w="100%" maxW="650px" h="5px">
						<Flex
							w="100%"
							h="5px"
							ml="-3px"
							backgroundColor="black"
							borderRadius="full"
						>
							<Flex
								w={`${((1 / 3) * (progressIndex + 1)) * 100}%`}
								h="5px"
								backgroundColor="green.100"
								shadow="0px 0px 15px #44FF19"
								borderRadius="full"
								zIndex={1}
								transition={`width ${intervalTimer / 3000}s ease-in-out`}
							/>
						</Flex>
					</Flex>

					<Flex direction="column">
						<Text
							fontFamily="Barlow Condensed"
							fontSize="60px"
							fontWeight={600}
							fontStyle="italic"
							letterSpacing="4.8px"
							color="#000000"
							textShadow="0px 0px 10px #00000029"
							userSelect="none"
							style={outlineStyle}
							mb="-32px"
						>
							SPORTS CARDS FOR &nbsp;
						</Text>
						<Text
							fontFamily="Barlow Condensed"
							fontSize="60px"
							fontWeight={600}
							fontStyle="italic"
							letterSpacing="4.8px"
							color="#000000"
							textShadow="0px 0px 10px #00000029"
							userSelect="none"
							style={outlineStyle}
							ml="0"
						>
							THE NEW ERA
						</Text>
					</Flex>
				</Flex>

				<Flex flexDir="column" my="80px">
					<Button
						variant="infoButton"
						_hover={{ md: { opacity: 0.8, fontStyle: "italic", padding: "0px 30px" } }}
						transition="padding 0.3s ease-out, box-shadow 0.3s ease-out, background 0.3s ease-out"
						letterSpacing={"1.5px"}
						bg={"green.600"}
						boxShadow={"0 0 100px green"}
						borderRadius="30px"
						pl="32px"
						mb="30px"
						isLoading={createButtonLoading}
						spinner={<BeatLoader color="white" size={8} />}
						onClick={() => {
							router.push("/create");
							setCreateButtonLoading(true);
						}}
					>
						<Text>
							START CREATING
						</Text>
						<ChevronRightIcon boxSize={8} marginLeft="auto" />
					</Button>
					<Button
						variant="infoButton"
						_hover={{ opacity: 0.8, fontStyle: "italic", padding: "0px 30px" }}
						transition="padding 0.3s ease-out, box-shadow 0.3s ease-out, background 0.3s ease-out"
						letterSpacing={"1.5px"}
						bg={"green.600"}
						boxShadow={"0 0 100px green"}
						borderRadius="30px"
						pl="32px"
						isLoading={collectButtonLoading}
						spinner={<BeatLoader color="white" size={8} />}
						onClick={() => {
							router.push("/lockerroom");
							setCollectButtonLoading(true);
						}}
					>
						<Text>
							START COLLECTING
						</Text>
						<ChevronRightIcon boxSize={8} marginLeft="auto" />
					</Button>
				</Flex>
			</Flex>
		</>
	);
}

/**
 * The Mobile vesion of the For The New Era view
 * @returns Mobile version of the For The New Era view
 */
export function ForTheNewEraMobile() {

	// What our header can be
	const textOptions = useMemo(() => {
		return [ "Capture", "Create", "Customize" ];
	}, []);

	const [ currentText, setCurrentText ] = useState(textOptions[0]);
	const [ opacity, setOpacity ] = useState(1);
	const [ progressIndex, setProgressIndex ] = useState(0);


	// Change the text every 3 seconds
	useEffect(() => {
		const intervalId = setInterval(() => {
			setOpacity(0);
			setProgressIndex((progressIndex + 1) % 3);

			// Wait a bit before changing the text
			setTimeout(() => {
				setCurrentText((prevText) => {
					const currentIndex = textOptions.indexOf(prevText);
					const nextIndex = (currentIndex + 1) % textOptions.length;
					return textOptions[nextIndex];
				});
				setOpacity(1);
			}, fadeTimer);

		}, intervalTimer);

		return () => {
			return clearInterval(intervalId);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ currentText ]);

	const textFlashStyle = {
		transition: `opacity ${fadeTimer / 2000}s ease-in-out`,
		opacity: opacity,
	};

	return (
		<>
			<Flex
				position="fixed"
				w="100vw"
				h="8vh"
				top="0"
				left="0"
				bgGradient="linear(to-b, #000, #00000000)"
				zIndex={-5}
			/>
			<Flex w="100vw" justifyContent="center">
				<Flex flexDir="column">
					<Text
						fontFamily="Brotherhood"
						fontSize="17vw"
						color="green.100"
						textShadow="0px 10px 6px #00000084"
						userSelect="none"
						marginBottom="-13vw"
						marginLeft="4px"
						zIndex={2}
						style={textFlashStyle}
					>
						{currentText}
					</Text>
					<Text
						fontFamily="barlow Condensed"
						fontSize="13vw"
						color="white"
						fontWeight={700}
						letterSpacing="5px"
						userSelect="none"
						zIndex={1}
					>
						YOUR MOMENT
					</Text>

					{/* Divider */}
					<Flex w="100%" maxW="650px" h="5px" mt="12px" mb="20px">
						<Flex
							w="100%"
							h="5px"
							ml="-3px"
							backgroundColor="black"
							borderRadius="full"
						>
							<Flex
								w={`${((1 / 3) * (progressIndex + 1)) * 100}%`}
								h="5px"
								backgroundColor="green.100"
								shadow="0px 0px 15px #44FF19"
								borderRadius="full"
								zIndex={1}
								transition={`width ${intervalTimer / 3000}s ease-in-out`}
							/>
						</Flex>
					</Flex>

					<Flex direction="column">
						<Text
							fontFamily="Barlow Condensed"
							fontSize="6vw"
							fontWeight={600}
							fontStyle="italic"
							letterSpacing="1.56px"
							color="white"
							textShadow="0px 0px 10px #00000029"
							userSelect="none"
						>
							SPORTS CARDS FOR THE NEW ERA
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</>
	);
}
