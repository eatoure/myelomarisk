import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:async';
import 'dart:math';
import 'package:video_player/video_player.dart';

class GradientButton extends StatelessWidget {
  final VoidCallback onPressed;
  final Widget child;

  const GradientButton({required this.onPressed, required this.child});

  @override
  Widget build(BuildContext context) {
    final double deviceWidth = MediaQuery.of(context).size.width;

    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        gradient: const LinearGradient(
          colors: [Color(0xFF0D47A1), Color(0xFF1976D2), Color(0xFF42A5F5)],
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(15),
          onTap: onPressed,
          child: Padding(
            padding: EdgeInsets.symmetric(
                horizontal: deviceWidth * 0.02, vertical: deviceWidth * 0.03),
            child: Center(
              child: DefaultTextStyle(
                style: Theme.of(context).textTheme.labelLarge!.copyWith(
                    color: Colors.white, fontSize: deviceWidth * 0.025),
                child: child,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

void main() {
  runApp(
    MaterialApp(
      title: 'Myelomarisk',
      theme: ThemeData(
        primaryColor: const Color.fromARGB(255, 31, 31, 31),
        scaffoldBackgroundColor: Colors.grey[200],
        textTheme: const TextTheme(
          labelLarge: TextStyle(
              fontFamily: 'Oswald', fontSize: 18, color: Colors.white),
          displayLarge: TextStyle(
              fontFamily: 'Oswald', fontSize: 20, color: Colors.white),
          displayMedium: TextStyle(
              fontFamily: 'Oswald', fontSize: 24, color: Colors.white),
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15),
          ),
        ),
        colorScheme: const ColorScheme(
          primary: Color(0xFF131255),
          secondary: Color(0xFF131255),
          surface: Colors.grey,
          background: Colors.grey,
          error: Colors.red,
          onPrimary: Colors.white,
          onSecondary: Colors.white,
          onSurface: Colors.black,
          onBackground: Colors.black,
          onError: Colors.white,
          brightness: Brightness.light,
        ).copyWith(background: Colors.grey[200]),
      ),
      home: _SplashScreen(),
    ),
  );
}

class FadeRoute extends PageRouteBuilder {
  final Widget page;

  FadeRoute({required this.page})
      : super(
          pageBuilder: (BuildContext context, Animation<double> animation,
              Animation<double> secondaryAnimation) {
            return page;
          },
          transitionsBuilder: (BuildContext context,
              Animation<double> animation,
              Animation<double> secondaryAnimation,
              Widget child) {
            return FadeTransition(
              opacity: animation,
              child: child,
            );
          },
        );
}

class _SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<_SplashScreen>
    with TickerProviderStateMixin {
  late final AnimationController _controller1;
  late final AnimationController _controller2;
  late final AnimationController _controller3;

  @override
  void initState() {
    super.initState();
    _controller1 = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    )..forward();
    _controller2 = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );
    _controller3 = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    Timer(const Duration(seconds: 2), () {
      _controller2.forward();
    });

    Timer(const Duration(seconds: 3), () {
      _controller3.forward();
    });

    Timer(const Duration(seconds: 5), () {
      Navigator.pushReplacement(
        context,
        FadeRoute(page: _HomePage()),
      );
    });
  }

  @override
  void dispose() {
    _controller1.dispose();
    _controller2.dispose();
    _controller3.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Get the device width and height
    final double deviceWidth = MediaQuery.of(context).size.width;
    final double deviceHeight = MediaQuery.of(context).size.height;

    // Calculate scaling factor based on a reference width of 1440 pixels
    final double scalingFactor = deviceWidth / 1440;

    return Scaffold(
      body: Stack(
        children: <Widget>[
          Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: const AssetImage(
                    'web/assets/national-cancer-institute-L7en7Lb-Ovc-unsplash.jpeg'),
                fit: BoxFit.cover,
                colorFilter: ColorFilter.mode(
                    Colors.black.withOpacity(0.7), BlendMode.darken),
              ),
            ),
          ),
          Positioned(
            top: deviceHeight * 0.25,
            left: 30 * scalingFactor, // Scaled
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FadeTransition(
                  opacity: _controller1,
                  child: Text(
                    'MyelomaRisk',
                    style: Theme.of(context)
                        .textTheme
                        .displayLarge!
                        .copyWith(fontSize: 0.095 * deviceWidth), // Scaled
                  ),
                ),
                FadeTransition(
                  opacity: _controller2,
                  child: Text(
                    'Simplifying the complex world of myeloma prognosis...',
                    style: Theme.of(context)
                        .textTheme
                        .displayMedium!
                        .copyWith(fontSize: 0.025 * deviceWidth), // Scaled
                  ),
                ),
                FadeTransition(
                  opacity: _controller3,
                  child: Text(
                    '...one patient at a time',
                    style: Theme.of(context)
                        .textTheme
                        .displayMedium!
                        .copyWith(fontSize: 0.025 * deviceWidth), // Scaled
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<_HomePage> {
  VideoPlayerController? _controller;

  @override
  void initState() {
    super.initState();
    _initializeVideo();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Future.delayed(const Duration(milliseconds: 300), () {
        _showDisclaimer(context);
      });
    });
  }

  void _initializeVideo() {
    _controller = VideoPlayerController.asset('web/assets/combined_video.mp4');

    _controller!.initialize().then((_) {
      _controller!.setVolume(0.0);
      _controller!.play();
      setState(() {});

      _controller!.addListener(() {
        if (_controller!.value.position >= _controller!.value.duration) {
          _controller!.seekTo(Duration.zero);
          _controller!.play();
        }
      });
    });
  }

  @override
  void dispose() {
    _controller?.dispose(); // Safely dispose of controller
    _controller?.removeListener(() {}); // Safely remove listener
    super.dispose();
  }

  /*
    Dialogue box for user consent prior to using calculator
  */
  void _showDisclaimer(BuildContext context) {
    showDialog(
        context: context,
        barrierDismissible: false, // user must tap button to close dialog box
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Disclaimer'),
            content: const SingleChildScrollView(
              // This allows the content to be scrollable
              child: Text(
                  "Those utilizing the MyelomaRisk on this platform (\"Calculator\") need to acknowledge that the Calculator, as a research instrument, hasn't received validation or endorsement by the United States Food and Drug Administration, the European Medicines Agency, or any equivalent entity. The Calculator is still in its development phase and is delivered \"as is,\" devoid of any supplementary services. \n\nmSMART reserves the right to implement changes to the Calculator at its discretion, without the obligation to notify the Calculator's users. The Calculator serves purely as an analytical tool and is not meant to replace professional medical guidance, or to provide medical diagnosis or prognosis. \n\nIf you have concerns regarding test outcomes or any health condition, it is recommended to consult your doctor or an accredited healthcare provider. mSMART will not be held responsible for any patient or Calculator user in relation to the Calculator's usage and/or results, or interpretation of its results. This Calculator is designed for non-commercial use only. For usage in a commercial context or to acquire a license, please reach out to S. Vincent Rajkumar (vincerk@gmail.com) or Shaji K. Kumar (kumarshaji@hotmail.com)."),
            ),
            actions: <Widget>[
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(7),
                  gradient: const LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Color(0xFF0D47A1),
                      Color(0xFF1976D2),
                      Color(0xFF42A5F5),
                    ],
                  ),
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () {
                      Navigator.of(context).pop();
                    },
                    child: const Padding(
                      padding:
                          EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                      child: Text(
                        'I Agree',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          );
        });
  }

  @override
  Widget build(BuildContext context) {
    final double deviceHeight = MediaQuery.of(context).size.height;
    final double deviceWidth = MediaQuery.of(context).size.width;
    // Calculate properties based on screen size
    int crossAxisCount = (deviceWidth / 1440 * 3).round();
    double aspectRatio = 6 / 1;
    double mainSpacing = deviceWidth / 1440 * 30;
    double crossSpacing = deviceWidth / 1440 * 30;
// Make sure crossAxisCount is at least 1
    if (crossAxisCount < 1) {
      crossAxisCount = 1;
    }
    return Scaffold(
      body: Container(
        width: deviceWidth,
        height: deviceHeight,
        color: Colors.black, // Fills any unfilled space with black
        child: Stack(
          children: <Widget>[
            Positioned.fill(
              child: _controller?.value.isInitialized ?? false
                  ? FittedBox(
                      fit: BoxFit.cover,
                      child: SizedBox(
                        width: _controller!.value.size.width,
                        height: _controller!.value.size.height,
                        child: VideoPlayer(_controller!),
                      ),
                    )
                  : Container(
                      // serves as a fallback when the video is not initialized.
                      color: Colors.black.withOpacity(0.7),
                    ),
            ),
            Container(
              //added for opacity over video
              width: deviceWidth,
              height: deviceHeight,
              color: Colors.black.withOpacity(0.5),
            ),
            // Text positioned on the left
            Positioned(
              top: deviceHeight * 0.2, // Adjusted
              left: deviceWidth * 0.02, // Adjusted
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'MyelomaRisk',
                    style: Theme.of(context).textTheme.displayLarge!.copyWith(
                        fontSize: deviceWidth * 0.1), // Adjusted Font Size
                  ),
                  Text(
                    'Simplifying the complex world of myeloma prognosis...\n...one patient at a time',
                    style: Theme.of(context).textTheme.displayMedium!.copyWith(
                        fontSize: deviceWidth * 0.025), // Adjusted Font Size
                  ),
                ],
              ),
            ),
            // Container for buttons and additional information
            Container(
              margin: EdgeInsets.only(top: deviceHeight * 0.6),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // GridView for button
                    Expanded(
                      child: GridView.builder(
                        // Padding around the entire grid
                        padding: const EdgeInsets.all(8.0),
                        // Use these calculated values in your grid
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: crossAxisCount, // Dynamically set
                          childAspectRatio: aspectRatio, // Dynamically set
                          mainAxisSpacing: mainSpacing, // Dynamically set
                          crossAxisSpacing: crossSpacing, // Dynamically set
                        ),

                        // This delegate function below was used prior to this with hardcoded numbers for a good
                        // look on a screen of size 1440 pi and most laptops
                        // gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        //   crossAxisCount:
                        //       3, // to control how wide buttons are horizontally. Increase to make buttons less wide
                        //   childAspectRatio: 6 /
                        //       1, // Adjusted aspect ratio (4/1 makes buttons bigger than 8/1)
                        //   // Spacing between rows (main-axis)
                        //   // Increasing this value will increase vertical spacing between rows
                        //   mainAxisSpacing: 30,
                        //   // Spacing between columns (cross-axis)
                        //   // Increasing this value will increase horizontal spacing between columns
                        //   crossAxisSpacing: 30,
                        // ),

                        // The builder function creates each button
                        itemBuilder: (context, index) {
                          // List of button titles and corresponding builder functions
                          final List<Map<String, dynamic>> buttonInfo = [
                            {
                              'title': 'Smoldering Multiple Myeloma',
                              'builder': () => _Smoldering()
                            },
                            {
                              'title': 'Multiple Myeloma',
                              'builder': () => _Multiple()
                            },
                            {'title': 'MGUS Prognosis', 'builder': () => _MGUSEx()},
                            {
    'title': 'MGUS: Bone Marrow Check',
    'builder': () => UrlLauncherScreen(), // Return a widget that handles the URL launching
  },
                  {
    'title': 'MGUS: Diagnosis Criteria for Light Chain',
    'builder': () => UrlLauncherScreenLC(), // Return a widget that handles the URL launching
  },
                            {
                              'title': 'Amyloidosis',
                              'builder': () => _AmyloidosisEx()
                            },
                            {
                              'title': 'Frailty',
                              'builder': () => FrailtyCalculatorPage()
                            },
                            
                            {
                              'title': 'Waldenstrom Macroglobulinemia',
                              'builder': () => WMCalculatorPage()
                            },
                            {
                              'title': 'Developers',
                              'builder': () => _AuthorsPage()
                            },
                          ];

                          return _buttonDesign(
                            context,
                            buttonInfo[index]['title'],
                            () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      buttonInfo[index]['builder'](),
                                ),
                              );
                            },
                          );
                        },

                        // The number of buttons you want to display
                        itemCount: 8,
                      ),
                    ),

                    // Additional information link
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        InkWell(
                          onTap: () async {
                            const url = 'https://msmart.org';
                            final uri = Uri.parse(url);
                            try {
                              if (await canLaunchUrl(uri)) {
                                await launchUrl(uri);
                              } else {
                                print('Could not launch $url');
                              }
                            } catch (e) {
                              print('An error occurred: $e');
                            }
                          },
                          child: const Text(
                            'For additional information, visit msmart.org',
                            style: TextStyle(
                              decoration: TextDecoration.underline,
                              color: Colors.blue,
                            ),
                          ),
                        ),
                        SizedBox(height: 10), // Add some space

                        Center(
                          child: Text.rich(
                            TextSpan(
                              children: [
                                TextSpan(
                                  text: 'Follow us on X / Twitter: ',
                                  style: TextStyle(
                                    color: Colors.white,
                                  ),
                                ),
                                TextSpan(
                                  text: 'S. Vincent Rajkumar, M.D. ',
                                  style: TextStyle(
                                    color: Colors.white,
                                  ),
                                ),
                                TextSpan(
                                  text: '(@vincentrk), ',
                                  style: TextStyle(
                                    color: Colors.blue,
                                  ),
                                  recognizer: TapGestureRecognizer()
                                    ..onTap = () async {
                                      const url =
                                          'https://twitter.com/vincentrk';
                                      final uri = Uri.parse(url);
                                      if (await canLaunchUrl(uri)) {
                                        await launchUrl(uri);
                                      }
                                    },
                                ),
                                TextSpan(
                                  text: 'Shaji Kumar, M.D. ',
                                  style: TextStyle(
                                    color: Colors.white,
                                  ),
                                ),
                                TextSpan(
                                  text: '(@myelomamd), ',
                                  style: TextStyle(
                                    color: Colors.blue,
                                  ),
                                  recognizer: TapGestureRecognizer()
                                    ..onTap = () async {
                                      const url =
                                          'https://twitter.com/myelomamd';
                                      final uri = Uri.parse(url);
                                      if (await canLaunchUrl(uri)) {
                                        await launchUrl(uri);
                                      }
                                    },
                                ),
                                TextSpan(
                                  text: 'E. Amadou Touré ',
                                  style: TextStyle(
                                    color: Colors.white,
                                  ),
                                ),
                                TextSpan(
                                  text: '(@eamadoutoure)',
                                  style: TextStyle(
                                    color: Colors.blue,
                                  ),
                                  recognizer: TapGestureRecognizer()
                                    ..onTap = () async {
                                      const url =
                                          'https://twitter.com/eamadoutoure';
                                      final uri = Uri.parse(url);
                                      if (await canLaunchUrl(uri)) {
                                        await launchUrl(uri);
                                      }
                                    },
                                ),
                              ],
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/*
  Widget for the buttons on the homepage
*/
Widget _buttonDesign(
    BuildContext context, String title, void Function() onPressedFunction) {
  final double deviceWidth = MediaQuery.of(context).size.width;
  final double deviceHeight = MediaQuery.of(context).size.height;

  final double buttonWidth = deviceWidth < 600 ? deviceWidth * 0.4 : 150;
  final double buttonHeight = deviceHeight * 0.1;
  final double fontSize = deviceWidth < 600 ? 12 : 16;

  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 4.0),
    child: SizedBox(
      width: buttonWidth,
      height: buttonHeight,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(15),
          gradient: const LinearGradient(
            colors: [Color(0xFF0D47A1), Color(0xFF1976D2), Color(0xFF42A5F5)],
          ),
        ),
        child: InkWell(
          onTap: onPressedFunction,
          borderRadius: BorderRadius.circular(15),
          child: Center(
            child: Text(
              title,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: fontSize,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

/*
  Widget for the references with a link attached
*/
Widget referenceTextWithLink(String input1, String input2, double deviceWidth) {
  final double factor = deviceWidth * 0.000390625;

  return Center(
    child: SizedBox(
      width: deviceWidth * 0.5,
      child: Center(
        child: RichText(
          textAlign: TextAlign.center,
          text: TextSpan(
            children: [
              TextSpan(
                text: 'Reference: ',
                style: TextStyle(
                  color: Colors.black,
                  fontSize: 12 + factor,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextSpan(
                text: input1,
                style: TextStyle(
                  color: Colors.black,
                  fontSize: 12 + factor,
                ),
              ),
              TextSpan(
                text: ' ',
                style: TextStyle(
                  color: Colors.black,
                  fontSize: 12 + factor,
                ),
              ),
              TextSpan(
                text: 'Link',
                style: TextStyle(
                  color: Colors.blue,
                  fontSize: 12 + factor,
                ),
                recognizer: TapGestureRecognizer()
                  ..onTap = () async {
                    final uri = Uri.parse(input2);
                    if (await canLaunchUrl(uri)) {
                      await launchUrl(uri);
                    } else {
                      print("Could not launch $input2");
                    }
                  },
              ),
            ],
          ),
        ),
      ),
    ),
  );
}

class UnderConstruction extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color(0xFF0D47A1),
                Color(0xFF1976D2),
                Color(0xFF42A5F5),
              ],
            ),
          ),
          child: AppBar(
            title: const Text('Under Construction'),
            backgroundColor: Colors.transparent,
            elevation: 0, // Removing any shadow beneath the app bar.
          ),
        ),
      ),
      body: const Center(
        child: Text('This page is under construction.'),
      ),
    );
  }
}

/*
  UrlLauncherButton` is a stateless widget that immediately attempts to
  open a specified URL in the user's web browser when the widget is built.
  This widget is intended for use cases where an immediate redirection to
  an external website is required from within the Flutter application.

  The widget utilizes the `url_launcher` package to launch the URL. If the
  URL cannot be launched (due to reasons like an invalid URL or insufficient
  permissions), an error is thrown. This widget should be used carefully to
  ensure it aligns with user expectations and app flow, as it triggers an
  external action without explicit user consent on tap.
*/
class UrlLauncherScreen extends StatefulWidget {
  @override
  _UrlLauncherScreenState createState() => _UrlLauncherScreenState();}

class _UrlLauncherScreenState extends State<UrlLauncherScreen> {
  final String url = 'https://istopmm.com/riskmodel/';

  @override
  void initState() {
    super.initState();
    _launchURL();
  }

  void _launchURL() async {
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    } else {
      throw 'Could not launch $url';
    }
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    // You might not need to return any widget if this screen is intended to be invisible,
    // but you need to return at least a Container or a similar widget to satisfy the build method requirement.
    return Container();
  }
}
/*
  This is duplicated code. Was too lazy to refactor the code and simply change one link. This one is for MGUS: Diagnostic
  criteria for light chain while the one above is for MGUS: Bone marrow
*/
class UrlLauncherScreenLC extends StatefulWidget {
  @override
  _UrlLauncherScreenStateLC createState() => _UrlLauncherScreenStateLC();}

class _UrlLauncherScreenStateLC extends State<UrlLauncherScreen> {
  final String url = 'https://istopmm.com/lcmgus/';

  @override
  void initState() {
    super.initState();
    _launchURL();
  }

  void _launchURL() async {
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    } else {
      throw 'Could not launch $url';
    }
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    // You might not need to return any widget if this screen is intended to be invisible,
    // but you need to return at least a Container or a similar widget to satisfy the build method requirement.
    return Container();
  }
}



class AuthorsService {
  final List<Map<String, dynamic>> authors = [
    {
      'name': 'Vincent Rajkumar, M.D.',
      'title': 'Hematologist at the Mayo Clinic',
      'bio':
          'Dr. S. Vincent Rajkumar is a distinguished researcher focusing on myeloma and related disorders. He has led multiple crucial clinical trials, including those resulting in the U.S. approval of thalidomide for myeloma treatment. His work greatly contributes to improving patient outcomes.',
      'image': 'web/assets/VincentRajkumar.jpg',
      'skills':
          'Clinical, Epidemiological, and Laboratory Research, Hematology',
      'email': 'vincerk@gmail.com',
      'twitter': 'https://twitter.com/vincentrk',
    },
    {
      'name': 'Shaji Kumar, M.D.',
      'title': 'Hematologist and Internist at the Mayo Clinic',
      'bio':
          'Dr. Shaji Kumar is a distinguished researcher and physician focusing in research on developing new myeloma treatments, investigating promising drugs and their combinations. He also studies myeloma biology and patient outcomes in myeloma and amyloidosis.',
      'image': 'web/assets/ShajiKumar.jpg',
      'skills':
          'Drug Development, Clinical Trials, In Vitro Research, Monoclonal Gammopathie, etc.',
      'email': 'kumarshaji@hotmail.com',
      'twitter': 'https://twitter.com/myelomamd',
    },
    {
      'name': 'Elhadji Amadou Touré',
      'title':
          'SREP Intern at the Mayo Clinic, Department of Otolaryngology -- Head and Neck Surgery',
      'bio':
          'Amadou, a junior at Carleton College, blends computer science and biochemistry in his pre-med journey. He interned at Mayo Clinic, delving into otolaryngology and medical oncology. His CS background contributed to the development of this tool.',
      'image': 'web/assets/AmadouToure.JPG',
      'skills':
          'Software Development, Laboratory, Healthcare Disparities, and Audiovisual Integration Research',
      'email': 'tourea@carleton.edu',
      'twitter': 'https://twitter.com/eamadoutoure',
    },
    // Add more authors as necessary
  ];
}

/*
(This class enters the author widget in any class needed)
*/
class AuthorsSection extends StatelessWidget {
  final List<Map<String, dynamic>> authors;
  final PageController controller;
  final double deviceWidth;
  final double deviceHeight;
  final double factor;

  AuthorsSection({
    required this.authors,
    required this.controller,
    required this.deviceWidth,
    required this.deviceHeight,
    required this.factor,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: deviceWidth * 0.7,
      child: ExpansionTile(
        leading: const Icon(Icons.person),
        title: Center(
          child: Text(
            'Authors',
            style: TextStyle(
              fontSize: 20 + factor,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
        ),
        children: <Widget>[
          SizedBox(height: deviceHeight * 0.02),
          Center(
            child: Column(
              children: [
                SizedBox(
                  height: deviceHeight * 0.35,
                  width: deviceWidth * 0.6,
                  child: PageView.builder(
                    controller: controller,
                    itemCount: authors.length,
                    itemBuilder: (context, index) {
                      return Card(
                        color: Colors.white, // Ensure card background is white
                        child: Row(
                          children: <Widget>[
                            Expanded(
                              child: Image.asset(
                                authors[index]['image'],
                                fit: BoxFit.cover,
                              ),
                            ),
                            Expanded(
                              child: Padding(
                                padding: EdgeInsets.all(deviceWidth * 0.02),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: <Widget>[
                                    Text(
                                      authors[index]['name'],
                                      style: TextStyle(
                                        fontSize: 28 + factor,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(authors[index]['title']),
                                    SizedBox(height: deviceHeight * 0.01),
                                    Flexible(
                                      child: SingleChildScrollView(
                                        child: Text(authors[index]['bio']),
                                      ),
                                    ),
                                    SizedBox(height: deviceHeight * 0.01),
                                    RichText(
                                      text: TextSpan(
                                        text: 'X / Twitter: @',
                                        style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 15 + factor,
                                        ),
                                        children: [
                                          TextSpan(
                                            text: authors[index]['twitter']
                                                .substring(authors[index]['twitter'].lastIndexOf('/') + 1),
                                            style: TextStyle(
                                              color: Colors.blue,
                                              fontSize: 15 + factor,
                                            ),
                                            recognizer: TapGestureRecognizer()..onTap = () async {
                                              var url = authors[index]['twitter'];
                                              final uri = Uri.parse(url);

                                              if (await canLaunchUrl(uri)) {
                                                await launchUrl(uri);
                                              }
                                            },
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        backgroundColor: const Color(0xFF42A5F5),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        elevation: 3,
                        shadowColor: const Color.fromARGB(255, 30, 0, 255).withOpacity(0.5),
                      ),
                      onPressed: () {
                        controller.previousPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      },
                      child: const Icon(Icons.arrow_back),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        backgroundColor: const Color(0xFF42A5F5),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        elevation: 3,
                        shadowColor: const Color.fromARGB(255, 30, 0, 255).withOpacity(0.5),
                      ),
                      onPressed: () {
                        controller.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      },
                      child: const Icon(Icons.arrow_forward),
                    ),
                  ],
                ),
                SizedBox(height: deviceHeight * 0.02),
              ],
            ),
          ),
        ],
      ),
    );
  }
}



class _Smoldering extends StatefulWidget {
  @override
  _SmolderingState createState() => _SmolderingState();
}

class _SmolderingState extends State<_Smoldering> {
  final _formKey1 = GlobalKey<FormState>();

  String? mProtein;
  String? freeSerumKappa;
  String? freeSerumLambda;
  String? marrowPlasmaPercentage;
  bool? cytogeneticAbnormalities;
  List<bool> isSelected = [false, false, false]; // for FISH toggle

  int calculateFLCScore(double fsk, double fsl) {
    double fLC = 0;
    if (fsk > fsl) {
      fLC = fsk / fsl;
    } else {
      fLC = fsl / fsk;
    }
    if (fLC <= 10) return 0;
    if (fLC > 10 && fLC <= 25) return 2;
    if (fLC > 25 && fLC <= 40) return 3;
    if (fLC > 40) return 5;
    return 0;
  }

  int calculateMProteinScore(double mProtein) {
    if (mProtein <= 1.5) return 0;
    if (mProtein > 1.5 && mProtein <= 3) return 3;
    if (mProtein > 3) return 4;
    return 0;
  }

  int calculateBMIScore(double bmi) {
    if (bmi <= 15) return 0;
    if (bmi > 15 && bmi <= 20) return 2;
    if (bmi > 20 && bmi <= 30) return 3;
    if (bmi > 30 && bmi <= 40) return 5;
    if (bmi > 40) return 6;
    return 0;
  }

  double calculatePercentageRisk(int score) {
    Map<int, double> scoreToRisk = {
      0: 1.3,
      2: 5.4,
      3: 2.6,
      4: 10.3,
      5: 19.2,
      6: 23.4,
      7: 27.6,
      8: 35,
      9: 48.6,
      10: 41.9,
      11: 50,
      12: 61.9,
      13: 50,
      14: 78.6,
      15: 83.3
    };

    if (score > 15) {
      return 88.9;
    } else {
      return scoreToRisk[score] ?? 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final PageController controller =
        PageController(viewportFraction: 0.95); // viewpoint of the author

    final double deviceHeight = MediaQuery.of(context).size.height;
    final double deviceWidth = MediaQuery.of(context).size.width;
    final authorsService = AuthorsService();
    final authors = authorsService.authors;
    final double factor = deviceWidth * 0.000390625;

    return Scaffold(
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(kToolbarHeight),
          child: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF0D47A1),
                  Color(0xFF1976D2),
                  Color(0xFF42A5F5),
                ],
              ),
            ),
            child: AppBar(
              title: const Text('Smoldering Multiple Myeloma'),
              backgroundColor: Colors.transparent,
              elevation: 0,
              centerTitle: true,
            ),
          ),
        ),
        body: LayoutBuilder(builder:
            (BuildContext context, BoxConstraints viewportConstraints) {
          return SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: viewportConstraints.maxHeight,
                  ),
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: <Widget>[
                        SizedBox(height: deviceHeight * 0.02),
                        Text(
                          'Smoldering Multiple Myeloma Prognosis',
                          style: TextStyle(
                            fontSize: 36 + factor,
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: deviceHeight * 0.02),
                        Text(
                          "Please respond to the following using the lab data provided at the time of initial diagnosis of Smoldering Multiple Myeloma",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              color: Theme.of(context).colorScheme.primary,
                              fontSize: 15 + factor),
                        ),
                        SizedBox(height: deviceHeight * 0.02),

                        // Create the form.
                        Center(
                          child: SizedBox(
                            width: deviceWidth * 0.5,
                            child: Form(
                              // Assign the GlobalKey to the form.
                              key: _formKey1,
                              child: Column(
                                children: <Widget>[
                                  // M-Protein field.
                                  SizedBox(
                                    width: deviceWidth * 0.5, //width of textbox
                                    child: TextFormField(
                                      // This field accepts only numerical input, including decimal values.
                                      keyboardType:
                                          const TextInputType.numberWithOptions(
                                              decimal: true),
                                      // Add some decoration to the field.
                                      decoration: InputDecoration(
                                        labelText: 'M-Protein',
                                        labelStyle: TextStyle(
                                            color: Theme.of(context)
                                                .colorScheme
                                                .primary,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15 + factor),
                                        border: const OutlineInputBorder(),
                                        hintText: 'Enter numbers only in gm/dl',
                                        hintStyle:
                                            TextStyle(fontSize: 15 + factor),
                                        suffixIcon: IconButton(
                                          icon: const Icon(Icons.info_outline),
                                          tooltip:
                                              '"Enter your lab results in gm/dl. If your M-Spike report is in gm/L, convert to gm/dl. For example, 25gm/L = 2.5 gm/dl.',
                                          onPressed: () {
                                            showDialog(
                                              context: context,
                                              builder: (context) =>
                                                  const AlertDialog(
                                                content: Text(
                                                    "Enter your lab results in gm/dl. If your M-Spike report is in gm/L, convert to gm/dl. For example, 25gm/L = 2.5 gm/dl."),
                                              ),
                                            );
                                          },
                                        ),
                                      ),
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Please enter some value';
                                        }
                                        return null;
                                      },
                                      // The onSaved callback stores the value in the mProtein variable.
                                      onSaved: (value) => mProtein = value,
                                    ),
                                  ),
                                  // Add some vertical space.
                                  SizedBox(height: deviceHeight * 0.02),
                                  // Free Serum Kappa field.
                                  SizedBox(
                                    width: deviceWidth * 0.5,
                                    child: TextFormField(
                                      keyboardType:
                                          const TextInputType.numberWithOptions(
                                              decimal: true),
                                      decoration: InputDecoration(
                                        labelText: 'Free Serum Kappa Level',
                                        labelStyle: TextStyle(
                                            color: Theme.of(context)
                                                .colorScheme
                                                .primary,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15 + factor),
                                        border: const OutlineInputBorder(),
                                        hintText: 'Enter numbers only',
                                      ),
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Please enter some value';
                                        }
                                        return null;
                                      },
                                      onSaved: (value) =>
                                          freeSerumKappa = value,
                                    ),
                                  ),
                                  // Add some vertical space.
                                  SizedBox(height: deviceHeight * 0.02),
                                  // Free Serum Lambda field.
                                  SizedBox(
                                    width: deviceWidth * 0.5,
                                    child: TextFormField(
                                      keyboardType:
                                          const TextInputType.numberWithOptions(
                                              decimal: true),
                                      decoration: InputDecoration(
                                        labelText: 'Free Serum Lambda Level',
                                        labelStyle: TextStyle(
                                            color: Theme.of(context)
                                                .colorScheme
                                                .primary,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15 + factor),
                                        border: const OutlineInputBorder(),
                                        hintText: 'Enter numbers only',
                                      ),
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Please enter some value';
                                        }
                                        return null;
                                      },
                                      onSaved: (value) =>
                                          freeSerumLambda = value,
                                    ),
                                  ),
                                  // Add some vertical space.
                                  SizedBox(height: deviceHeight * 0.02),
                                  // Bone Marrow Plasma Cell field.
                                  SizedBox(
                                    width: deviceWidth * 0.5,
                                    child: TextFormField(
                                      keyboardType:
                                          const TextInputType.numberWithOptions(
                                              decimal: true),
                                      decoration: InputDecoration(
                                        labelText: 'Bone Marrow Plasma Cell %',
                                        labelStyle: TextStyle(
                                            color: Theme.of(context)
                                                .colorScheme
                                                .primary,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15 + factor),
                                        border: const OutlineInputBorder(),
                                        hintText: 'Enter numbers only',
                                      ),
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Please enter some value';
                                        }
                                        return null;
                                      },
                                      onSaved: (value) =>
                                          marrowPlasmaPercentage = value,
                                    ),
                                  ),
                                  // Add some vertical space.
                                  // Cytogenetic Abnormalities field.
                                  SizedBox(height: deviceHeight * 0.02),
                                  if (deviceWidth < 1050)
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Any High Risk Cytogenetic Abnormalities?',
                                          style: TextStyle(
                                            color: Theme.of(context)
                                                .colorScheme
                                                .primary,
                                            fontSize: 15 + factor,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.info_outline),
                                          tooltip:
                                              'A cytogenetic abnormality refers to the presence of t(4;14), t(14;16), +1q, and del13q/monosomy 13 by FISH',
                                          onPressed: () {
                                            showDialog(
                                              context: context,
                                              builder: (BuildContext context) {
                                                return AlertDialog(
                                                  content: const Text(
                                                      'A cytogenetic abnormality refers to the presence of t(4;14), t(14;16), +1q, and del13q/monosomy 13 by FISH'),
                                                  actions: <Widget>[
                                                    TextButton(
                                                      child:
                                                          const Text('Close'),
                                                      onPressed: () {
                                                        Navigator.of(context)
                                                            .pop();
                                                      },
                                                    )
                                                  ],
                                                );
                                              },
                                            );
                                          },
                                        ),
                                        ToggleButtons(
                                          isSelected: isSelected,
                                          onPressed: (int newIndex) {
                                            setState(() {
                                              for (int index = 0;
                                                  index < isSelected.length;
                                                  index++) {
                                                if (index == newIndex) {
                                                  isSelected[index] = true;
                                                } else {
                                                  isSelected[index] = false;
                                                }
                                              }
                                            });
                                          },
                                          color: Colors.grey,
                                          selectedColor: Colors.white,
                                          fillColor: isSelected[0]
                                              ? Colors.green
                                              : isSelected[1]
                                                  ? Colors.red
                                                  : Colors.grey,
                                          borderColor: Colors.grey,
                                          selectedBorderColor: Colors.grey,
                                          borderRadius:
                                              BorderRadius.circular(30),
                                          children: <Widget>[
                                            Padding(
                                              padding:
                                                  const EdgeInsets.all(5.0),
                                              child: Text('Yes',
                                                  style: TextStyle(
                                                      fontSize: min(16.0,
                                                          deviceWidth * 0.015),
                                                      fontWeight:
                                                          FontWeight.bold)),
                                            ),
                                            Padding(
                                              padding:
                                                  const EdgeInsets.all(5.0),
                                              child: Text('No',
                                                  style: TextStyle(
                                                      fontSize: min(16.0,
                                                          deviceWidth * 0.015),
                                                      fontWeight:
                                                          FontWeight.bold)),
                                            ),
                                            Padding(
                                              padding:
                                                  const EdgeInsets.all(5.0),
                                              child: Text('Unsure',
                                                  style: TextStyle(
                                                      fontSize: min(16.0,
                                                          deviceWidth * 0.015),
                                                      fontWeight:
                                                          FontWeight.bold)),
                                            ),
                                          ],
                                        ),
                                      ],
                                    )
                                  else
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: <Widget>[
                                        Row(
                                          children: [
                                            Text(
                                              'Any High Risk Cytogenetic Abnormalities?',
                                              style: TextStyle(
                                                color: Theme.of(context)
                                                    .colorScheme
                                                    .primary,
                                                fontSize: 15 + factor,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            IconButton(
                                              icon: const Icon(
                                                  Icons.info_outline),
                                              tooltip:
                                                  'A cytogenetic abnormality refers to the presence of t(4;14), t(14;16), +1q, and del13q/monosomy 13 by FISH',
                                              onPressed: () {
                                                showDialog(
                                                  context: context,
                                                  builder:
                                                      (BuildContext context) {
                                                    return AlertDialog(
                                                      content: const Text(
                                                          'A cytogenetic abnormality refers to the presence of t(4;14), t(14;16), +1q, and del13q/monosomy 13 by FISH'),
                                                      actions: <Widget>[
                                                        TextButton(
                                                          child: const Text(
                                                              'Close'),
                                                          onPressed: () {
                                                            Navigator.of(
                                                                    context)
                                                                .pop();
                                                          },
                                                        )
                                                      ],
                                                    );
                                                  },
                                                );
                                              },
                                            ),
                                          ],
                                        ),
                                        ToggleButtons(
                                          isSelected: isSelected,
                                          onPressed: (int newIndex) {
                                            setState(() {
                                              for (int index = 0;
                                                  index < isSelected.length;
                                                  index++) {
                                                if (index == newIndex) {
                                                  isSelected[index] = true;
                                                } else {
                                                  isSelected[index] = false;
                                                }
                                              }
                                            });
                                          },
                                          color: Colors.grey,
                                          selectedColor: Colors.white,
                                          fillColor: isSelected[0]
                                              ? Colors.green
                                              : isSelected[1]
                                                  ? Colors.red
                                                  : Colors.grey,
                                          borderColor: Colors.grey,
                                          selectedBorderColor: Colors.grey,
                                          borderRadius:
                                              BorderRadius.circular(30),
                                          children: <Widget>[
                                            Padding(
                                              padding:
                                                  const EdgeInsets.all(5.0),
                                              child: Text('Yes',
                                                  style: TextStyle(
                                                      fontSize: min(
                                                          16.0,
                                                          deviceWidth *
                                                              0.015))),
                                            ),
                                            Padding(
                                              padding:
                                                  const EdgeInsets.all(5.0),
                                              child: Text('No',
                                                  style: TextStyle(
                                                      fontSize: min(
                                                          16.0,
                                                          deviceWidth *
                                                              0.015))),
                                            ),
                                            Padding(
                                              padding:
                                                  const EdgeInsets.all(5.0),
                                              child: Text('Unsure',
                                                  style: TextStyle(
                                                      fontSize: min(
                                                          16.0,
                                                          deviceWidth *
                                                              0.015))),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  SizedBox(height: deviceHeight * 0.02),

                                  // Create the Calculate button.
                                  ElevatedButton(
  style: ElevatedButton.styleFrom(
    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
    backgroundColor: const Color(0xFF42A5F5), // Directly setting the background color
    foregroundColor: Colors.white, // Directly setting the text color
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(15),
    ),
    elevation: 3, // Directly setting elevation
    shadowColor: const Color.fromARGB(255, 30, 0, 255).withOpacity(0.5), // Directly setting shadow color
  ),
                                    // When the button is pressed, validate the fields and calculate the risk.
                                    onPressed: () {
                                      if (_formKey1.currentState!.validate() &&
                                          isSelected.contains(true)) {
                                        _formKey1.currentState!.save();

                                        // Calculate the scores
                                        int fLC = calculateFLCScore(
                                            double.parse(freeSerumKappa!),
                                            double.parse(freeSerumLambda!));
                                        int mProteinScore =
                                            calculateMProteinScore(
                                                double.parse(mProtein!));
                                        int bmi = calculateBMIScore(
                                            double.parse(
                                                marrowPlasmaPercentage!));

                                        int totalScore =
                                            fLC + mProteinScore + bmi;
                                        if (isSelected[0]) {
                                          // If 'Yes' is selected
                                          totalScore += 2;
                                        }
                                        double percentageRisk =
                                            calculatePercentageRisk(totalScore);

                                        // Display the percentage risk
                                        showDialog(
                                          context: context,
                                          builder: (_) => AlertDialog(
                                            title: const Text('Results'),
                                            content: SingleChildScrollView(
                                              child: RichText(
                                                text: TextSpan(
                                                  style: DefaultTextStyle.of(
                                                          context)
                                                      .style,
                                                  children: [
                                                    const TextSpan(
                                                      text:
                                                          'The 2-year progression risk from the time of initial diagnosis is ',
                                                    ),
                                                    TextSpan(
                                                      text:
                                                          '${percentageRisk.toStringAsFixed(1)}%',
                                                      style: const TextStyle(
                                                          fontWeight:
                                                              FontWeight.bold),
                                                    ),
                                                    const TextSpan(
                                                      text:
                                                          '\n\n', // Add two line breaks for more spacing
                                                    ),
                                                    const TextSpan(
                                                      text:
                                                          'This information is for patients who are not receiving any treatment for Smoldering Multiple Myeloma.',
                                                      style: TextStyle(
                                                          fontWeight:
                                                              FontWeight.bold),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                            actions: <Widget>[
                                              TextButton(
                                                child: const Text('Close'),
                                                onPressed: () {
                                                  Navigator.of(context).pop();
                                                },
                                              )
                                            ],
                                          ),
                                        );
                                      } else {
                                        showDialog(
                                          context: context,
                                          builder: (_) => AlertDialog(
                                            title: const Text('Alert'),
                                            content: const Text(
                                                'Please answer all questions before proceeding.'),
                                            actions: <Widget>[
                                              TextButton(
                                                child: const Text('Ok'),
                                                onPressed: () {
                                                  Navigator.of(context).pop();
                                                },
                                              )
                                            ],
                                          ),
                                        );
                                      }
                                    },
                                   child: const Text('Calculate'),
),
                                ],
                              ),
                            ),
                          ),
                        ),

                        SizedBox(
                            height: deviceHeight * 0.05), // add vertical space
                        referenceTextWithLink(
                            "Mateos MV, Kumar S, Dimopoulos MA, et al. International Myeloma Working Group risk stratification model for smoldering multiple myeloma (SMM). Blood Cancer J. 2020 Oct 16;10(10):102.",
                            "https://doi.org/10.1038/s41408-020-00366-3",
                            deviceWidth),
                        // Authors section
                        SizedBox(
                            height: deviceHeight * 0.05), // add vertical space
                        if (deviceWidth > 600)
                          AuthorsSection(
                            authors: authors,
                            controller: controller,
                            deviceWidth: deviceWidth,
                            deviceHeight: deviceHeight,
                            factor: factor,
                          )
                      ])));
        }));
  }
}

class _Multiple extends StatefulWidget {
  @override
  _MultipleState createState() => _MultipleState();
}

class _MultipleState extends State<_Multiple> {
  final _formKey2 = GlobalKey<FormState>();
  int hasHighRiskIghTranslocation = 0;
  int has1qGainAmplification = 0;
  int hasChromosome17Abnormality = 0;
  double b2Microglobulin = 0.0;
  int hasElevatedLDH = 0;

  void _validateAndSave() {
    final form = _formKey2.currentState;
    if (form!.validate()) {
      form.save();
      _calculateScore();
    }
  }

  void _calculateScore() {
    int score = 0;
    if (hasHighRiskIghTranslocation == 1) score++;
    if (has1qGainAmplification == 1) score++;
    if (hasChromosome17Abnormality == 1) score++;
    if (b2Microglobulin > 5.5) score++;
    if (hasElevatedLDH == 1) score++;

    String pfs = "", os = "";

    switch (score) {
      case 0:
        pfs = "63.1 months";
        os = "11 years";
        break;
      case 1:
        pfs = "44 months";
        os = "7 years";
        break;
      default:
        pfs = "28.6 months";
        os = "4.5 years";
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Risk Score Results"),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                    'Median Progression-Free Survival Survival with Frontline Therapy is Expected to Exceed:'),
                Text(
                  pfs,
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 8),
                Text(
                    'Median Overall Survival from the Time of Diagnosis is Expected to Exceed:'),
                Text(
                  os,
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 16),
                Text(
                  'Estimates are for newly diagnosed patients based on variables at initial diagnosis. "Median" means that 50% of patients have outcomes similar or better than the estimate provided. This information is based on data available until 2022, and with recent advances will be better than the estimates provided.',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Close'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final PageController controller =
        PageController(viewportFraction: 0.95); // viewpoint of the author

    final double deviceHeight = MediaQuery.of(context).size.height;
    final double deviceWidth = MediaQuery.of(context).size.width;
    final double factor = deviceWidth * 0.000390625;
    final authorsService = AuthorsService();
    final authors = authorsService.authors;

    Widget buildQuestion(
        String questionText, int? groupValue, Function(int?) onChanged) {
      return LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          if (constraints.maxWidth < 600) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center, // Center the widgets
              children: [
                Text(
                  questionText,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
                Row(
                  mainAxisAlignment:
                      MainAxisAlignment.center, // Center the widgets
                  children: [
                    Text('No'),
                    Radio(
                      value: 0,
                      groupValue: groupValue,
                      onChanged: onChanged,
                    ),
                    Text('Yes'),
                    Radio(
                      value: 1,
                      groupValue: groupValue,
                      onChanged: onChanged,
                    ),
                  ],
                ),
              ],
            );
          } else {
            return Center(
              child: SizedBox(
                width: MediaQuery.of(context).size.width * 0.5, // Set the width
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      questionText,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                    Row(
                      mainAxisAlignment:
                          MainAxisAlignment.center, // Center the widgets
                      children: [
                        Text('No'),
                        Radio(
                          value: 0,
                          groupValue: groupValue,
                          onChanged: onChanged,
                        ),
                        Text('Yes'),
                        Radio(
                          value: 1,
                          groupValue: groupValue,
                          onChanged: onChanged,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }
        },
      );
    }

    return Scaffold(
        appBar: AppBar(
          title: const Text("Multiple Myeloma"),
          flexibleSpace: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF0D47A1),
                  Color(0xFF1976D2),
                  Color(0xFF42A5F5),
                ],
              ),
            ),
          ),
        ),
        body: Padding(
            padding: EdgeInsets.symmetric(
                horizontal: deviceWidth * 0.05), // changed padding here
            child: Form(
              key: _formKey2,
              child: SingleChildScrollView(
                  child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                    SizedBox(height: deviceWidth * 0.02),
                    Text(
                      "Newly Diagnosed Multiple Myeloma Risk Stratification",
                      style: TextStyle(
                          fontSize: 36 + factor,
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).colorScheme.primary),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: deviceWidth * 0.02),
                    Text(
                      "Using lab data at the time of initial diagnosis of Multiple Myeloma, please answer with \"Yes\" or \"No\" to the following questions and enter a ß-2 microglobulin level to calculate a risk score.",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          color: Theme.of(context).colorScheme.primary,
                          fontSize: 15 + factor),
                    ),
                    SizedBox(height: deviceHeight * 0.02),

                    // High-risk IGH Translocation
                    buildQuestion(
                      "High-risk IGH Translocation (t4;14, t14;16, or t14;20)?",
                      hasHighRiskIghTranslocation,
                      (int? value) {
                        setState(() {
                          hasHighRiskIghTranslocation = value ?? 0;
                        });
                      },
                    ),
    
                    SizedBox(height: deviceHeight * 0.02),

                    // 1q Gain/Amplification
                    buildQuestion(
                      "1q Gain/Amplification?",
                      has1qGainAmplification,
                      (int? value) {
                        setState(() {
                          has1qGainAmplification = value ?? 0;
                        });
                      },
                    ),
                    SizedBox(height: deviceHeight * 0.02),

                    // Chromosome 17 Abnormality
                    buildQuestion(
                      "Chromosome 17 Abnormality?",
                      hasChromosome17Abnormality,
                      (int? value) {
                        setState(() {
                          hasChromosome17Abnormality = value ?? 0;
                        });
                      },
                    ),
                    SizedBox(height: deviceHeight * 0.02),

                    // Elevated LDH
                    buildQuestion(
                      "Elevated LDH?",
                      hasElevatedLDH,
                      (int? value) {
                        setState(() {
                          hasElevatedLDH = value ?? 0;
                        });
                      },
                    ),
                    SizedBox(height: deviceHeight * 0.02),

                    SizedBox(
                      width: deviceWidth * 0.5,
                      child: TextFormField(
                        keyboardType: const TextInputType.numberWithOptions(
                            decimal: true),
                        decoration: InputDecoration(
                          labelText: 'Serum ß-2 microglobulin',
                          labelStyle: TextStyle(
                              color: Theme.of(context).colorScheme.primary,
                              fontWeight: FontWeight.bold),
                          border: const OutlineInputBorder(),
                          hintText: 'Enter numbers only in mg/L',
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter some value';
                          }
                          return null;
                        },
                        onSaved: (value) =>
                            b2Microglobulin = double.parse(value!),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                      child: ElevatedButton(
  style: ElevatedButton.styleFrom(
    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
    backgroundColor: const Color(0xFF42A5F5), // Directly setting the background color
    foregroundColor: Colors.white, // Directly setting the text color
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(15),
    ),
    elevation: 3, // Directly setting elevation
    shadowColor: const Color.fromARGB(255, 30, 0, 255).withOpacity(0.5), // Directly setting shadow color
  ),
                        onPressed: _validateAndSave,
                        child: const Text("Calculate"),
                      ),
                    ),
                    SizedBox(height: deviceHeight * 0.05), // add vertical space
                    referenceTextWithLink(
                        "Abdallah, N.H., Binder, M., Rajkumar, S.V. et al. A simple additive staging system for newly diagnosed multiple myeloma. Blood Cancer J. 12, 21 (2022).",
                        "https://doi.org/10.1038/s41408-022-00611-x",
                        deviceWidth),
                    SizedBox(height: deviceHeight * 0.05), // add vertical space
                    if (deviceWidth > 600)
                      AuthorsSection(
                        authors: authors,
                        controller: controller,
                        deviceWidth: deviceWidth,
                        deviceHeight: deviceHeight,
                        factor: factor,
                      )
                  ])),
            )));
  }
}

class _MGUSEx extends StatefulWidget {
  @override
  _MGUS createState() => _MGUS();
}

class _MGUS extends State<_MGUSEx> {
  final _formKey3 = GlobalKey<FormState>();
  final _formKey4 = GlobalKey<FormState>();
  double serumMProtein = 0.0;
  int isIgG = 0;
  double freeSerumLambda = 0.0;
  double freeSerumKappa = 0.0;

  void _validateAndSave() {
    final form3 = _formKey3.currentState;
    final form4 = _formKey4.currentState;

    if (form3!.validate() && form4!.validate()) {
      form3.save();
      form4.save();
      _calculateScore();
    } else {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text("Validation Error"),
            content: const Text(
                "Please enter valid information in all the fields requested."),
            actions: <Widget>[
              TextButton(
                child: const Text('Close'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    }
  }

  void _calculateScore() {
    int score = 0;

    if (serumMProtein > 15) score++;
    if (isIgG == 0) score++;

    double ratio = freeSerumLambda > freeSerumKappa
        ? freeSerumLambda / freeSerumKappa
        : freeSerumKappa / freeSerumLambda;

    if (ratio < 0.26 || ratio > 1.65) score++;

    String absoluteRisk = "";

    switch (score) {
      case 0:
        absoluteRisk = "2%";
        break;
      case 1:
        absoluteRisk = "10%";
        break;
      case 2:
        absoluteRisk = "18%";
        break;
      case 3:
        absoluteRisk = "27%";
        break;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Risk Score Results"),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Absolute Risk of Progression:'),
                Text(
                  absoluteRisk,
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 16),
                Text(
                  'Absolute risk is the likelihood of developing progression to myeloma or related disorder over a 20 year period from diagnosis after adjusting for competing causes of death.',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Close'),
              onPressed: () {
                Navigator.of(context).pop();
                _resetForm();
              },
            ),
          ],
        );
      },
    );
  }

  void _resetForm() {
    _formKey3.currentState!.reset();
    setState(() {
      serumMProtein = 0.0;
      isIgG = 0;
      freeSerumLambda = 0.0;
      freeSerumKappa = 0.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final double deviceWidth = MediaQuery.of(context).size.width;
    final double deviceHeight = MediaQuery.of(context).size.height;
    AuthorsService authorsService = AuthorsService(); // New instance
    final authors = authorsService.authors;
    final double factor = deviceWidth * 0.000390625;
    final PageController controller =
        PageController(viewportFraction: 0.95); // viewpoint
    return Scaffold(
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(kToolbarHeight),
          child: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF0D47A1),
                  Color(0xFF1976D2),
                  Color(0xFF42A5F5),
                ],
              ),
            ),
            child: AppBar(
              title: const Text(
                  'Monoclonal Gammopathy of Undetermined Significance'),
              backgroundColor: Colors.transparent,
              elevation: 0,
              centerTitle: true,
            ),
          ),
        ),
        body: Padding(
            padding: EdgeInsets.symmetric(
                horizontal: deviceWidth * 0.1), // Increased padding
            child: Form(
                key: _formKey3,
                child: SingleChildScrollView(
                    child: Column(children: [
                  SizedBox(height: deviceHeight * 0.05),
                  Text(
                    "MGUS Prognosis",
                    style: TextStyle(
                      fontSize: 36 + factor,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: deviceHeight * 0.02),
                  Form(
                    key: _formKey4,
                    child: SingleChildScrollView(
                        child: Column(children: [
                      SizedBox(
                        width: deviceWidth * 0.5,
                        child: TextFormField(
                          keyboardType: const TextInputType.numberWithOptions(
                              decimal: true),
                          decoration: InputDecoration(
                            labelText: 'Serum M-Protein Level',
                            labelStyle: TextStyle(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.bold),
                            border: const OutlineInputBorder(),
                            hintText: 'Enter numbers only in g/dl',
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter some value';
                            }
                            return null;
                          },
                          onSaved: (value) =>
                              serumMProtein = double.parse(value!),
                        ),
                      ),
                      SizedBox(height: deviceHeight * 0.02),

                      Center(
                        child: SizedBox(
                          width: deviceWidth * 0.5,
                          child: TextFormField(
                            keyboardType: const TextInputType.numberWithOptions(
                                decimal: true),
                            decoration: InputDecoration(
                              labelText: 'Free Serum Lambda Level',
                              labelStyle: TextStyle(
                                  color: Theme.of(context).colorScheme.primary,
                                  fontWeight: FontWeight.bold),
                              border: const OutlineInputBorder(),
                              hintText: 'Enter numbers only',
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter some value';
                              }
                              return null;
                            },
                            onSaved: (value) =>
                                freeSerumLambda = double.parse(value!),
                          ),
                        ),
                      ),
                      SizedBox(height: deviceHeight * 0.02),

                      SizedBox(
                        width: deviceWidth * 0.5,
                        child: TextFormField(
                          keyboardType: const TextInputType.numberWithOptions(
                              decimal: true),
                          decoration: InputDecoration(
                            labelText: 'Free Serum Kappa Level',
                            labelStyle: TextStyle(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.bold),
                            border: const OutlineInputBorder(),
                            hintText: 'Enter numbers only',
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter some value';
                            }
                            return null;
                          },
                          onSaved: (value) =>
                              freeSerumKappa = double.parse(value!),
                        ),
                      ),
                      SizedBox(height: deviceHeight * 0.02),
                      // IgG Question
                      LayoutBuilder(
                        builder:
                            (BuildContext context, BoxConstraints constraints) {
                          if (constraints.maxWidth < 600) {
                            return Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  "Is the diagnosis associated with an IgG subtype?",
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color:
                                        Theme.of(context).colorScheme.primary,
                                  ),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text('No'),
                                    Radio(
                                      value: 0,
                                      groupValue: isIgG,
                                      onChanged: (int? value) {
                                        setState(() {
                                          isIgG = value ?? 0;
                                        });
                                      },
                                    ),
                                    Text('Yes'),
                                    Radio(
                                      value: 1,
                                      groupValue: isIgG,
                                      onChanged: (int? value) {
                                        setState(() {
                                          isIgG = value ?? 0;
                                        });
                                      },
                                    ),
                                  ],
                                ),
                              ],
                            );
                          } else {
                            return SizedBox(
                              width: deviceWidth * 0.5,
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    "Is the diagnosis associated with an IgG subtype?",
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color:
                                          Theme.of(context).colorScheme.primary,
                                    ),
                                  ),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text('No'),
                                      Radio(
                                        value: 0,
                                        groupValue: isIgG,
                                        onChanged: (int? value) {
                                          setState(() {
                                            isIgG = value ?? 0;
                                          });
                                        },
                                      ),
                                      Text('Yes'),
                                      Radio(
                                        value: 1,
                                        groupValue: isIgG,
                                        onChanged: (int? value) {
                                          setState(() {
                                            isIgG = value ?? 0;
                                          });
                                        },
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            );
                          }
                        },
                      ),

                      SizedBox(height: deviceHeight * 0.02),
                      ElevatedButton(
  style: ElevatedButton.styleFrom(
    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
    backgroundColor: const Color(0xFF42A5F5), // Directly setting the background color
    foregroundColor: Colors.white, // Directly setting the text color
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(15),
    ),
    elevation: 3, // Directly setting elevation
    shadowColor: const Color.fromARGB(255, 30, 0, 255).withOpacity(0.5), // Directly setting shadow color
  ),
                        onPressed: _validateAndSave,
                        child: const Text("Calculate"),
                      ),
                      SizedBox(
                          height: deviceHeight * 0.05), // add vertical space
                      referenceTextWithLink(
                          "Rajkumar SV, Kyle RA, Therneau TM, et al. Serum free light chain ratio is an independent risk factor for progression in monoclonal gammopathy of undetermined significance. Blood (2005) 106 (3): 812-817.",
                          "https://doi.org/10.1182/blood-2005-03-1038",
                          deviceWidth),
                      SizedBox(height: deviceHeight * 0.05),
                      if (deviceWidth > 600)
                        AuthorsSection(
                          authors: authors,
                          controller: controller,
                          deviceWidth: deviceWidth,
                          deviceHeight: deviceHeight,
                          factor: factor,
                        )
                    ])),
                  )
                ])))));
  }
}

class _AmyloidosisEx extends StatefulWidget {
  @override
  _Amyloidosis createState() => _Amyloidosis();
}


class _Amyloidosis extends State<_AmyloidosisEx> {
  final _formKey3 = GlobalKey<FormState>();
  final _formKey4 = GlobalKey<FormState>();
  double cTnT = 0.0;
  double NTproBNP = 00;
  double freeSerumLambda = 0.0;
  double freeSerumKappa = 0.0;

  void _validateAndSave() {
    final form3 = _formKey3.currentState;
    final form4 = _formKey4.currentState;

    if (form3!.validate() && form4!.validate()) {
      form3.save();
      form4.save();
      _calculateScore();
    } else {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text("Validation Error"),
            content: const Text(
                "Please enter valid information in all the fields requested."),
            actions: <Widget>[
              TextButton(
                child: const Text('Close'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    }
  }

  void _calculateScore() {
    int score = 0;

    if (cTnT >= 0.025) score++;
    if (NTproBNP >=1800) score++;

    double difference = freeSerumLambda - freeSerumKappa;
  

    if (difference.abs() >= 180) score++;

    String stage = "";

    switch (score) {
      case 0:
        stage = "1";
        break;
      case 1:
        stage = "2";
        break;
      case 2:
        stage = "3";
        break;
      case 3:
        stage = "4";
        break;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Stage Results"),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
             children: [
  Text(
    'The risk factors provided are correspondent with Stage $stage of AL amyloidosis.',
    style: TextStyle(fontWeight: FontWeight.bold),
  ),
  SizedBox(height: 16),
  Text(
    'This data conforms to the Mayo 2012 Model for biomarker models used in systemic amyloidosis.',
    style: TextStyle(fontWeight: FontWeight.bold),
  ),
],

            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Close'),
              onPressed: () {
                Navigator.of(context).pop();
                _resetForm();
              },
            ),
          ],
        );
      },
    );
  }

  void _resetForm() {
    _formKey3.currentState!.reset();
    setState(() {
      cTnT = 0.0;
      NTproBNP = 0;
      freeSerumLambda = 0.0;
      freeSerumKappa = 0.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final double deviceWidth = MediaQuery.of(context).size.width;
    final double deviceHeight = MediaQuery.of(context).size.height;
    AuthorsService authorsService = AuthorsService(); // New instance
    final authors = authorsService.authors;
    final double factor = deviceWidth * 0.000390625;
    final PageController controller =
        PageController(viewportFraction: 0.95); // viewpoint
    return Scaffold(
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(kToolbarHeight),
          child: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF0D47A1),
                  Color(0xFF1976D2),
                  Color(0xFF42A5F5),
                ],
              ),
            ),
            child: AppBar(
              title: const Text(
                  'Amyloidosis'),
              backgroundColor: Colors.transparent,
              elevation: 0,
              centerTitle: true,
            ),
          ),
        ),
        body: Padding(
            padding: EdgeInsets.symmetric(
                horizontal: deviceWidth * 0.1), // Increased padding
            child: Form(
                key: _formKey3,
                child: SingleChildScrollView(
                    child: Column(children: [
                  SizedBox(height: deviceHeight * 0.05),
                  Text(
                    "Amyloidosis Staging System",
                    style: TextStyle(
                      fontSize: 36 + factor,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: deviceHeight * 0.02),
                  Form(
                    key: _formKey4,
                    child: SingleChildScrollView(
                        child: Column(children: [
                      SizedBox(
                        width: deviceWidth * 0.5,
                        child: TextFormField(
                          keyboardType: const TextInputType.numberWithOptions(
                              decimal: true),
                          decoration: InputDecoration(
                            labelText: 'Cardiac Troponin Level (cTnT)',
                            labelStyle: TextStyle(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.bold),
                            border: const OutlineInputBorder(),
                            hintText: 'Enter numbers only in µg/L',
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter some value';
                            }
                            return null;
                          },
                          onSaved: (value) =>
                              cTnT = double.parse(value!),
                        ),
                      ),
                      SizedBox(height: deviceHeight * 0.02),

                      Center(
                        child: SizedBox(
                          width: deviceWidth * 0.5,
                          child: TextFormField(
                            keyboardType: const TextInputType.numberWithOptions(
                                decimal: true),
                            decoration: InputDecoration(
                              labelText: 'Free Serum Lambda Level',
                              labelStyle: TextStyle(
                                  color: Theme.of(context).colorScheme.primary,
                                  fontWeight: FontWeight.bold),
                              border: const OutlineInputBorder(),
                              hintText: 'Enter numbers only in mg/L',
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter some value';
                              }
                              return null;
                            },
                            onSaved: (value) =>
                                freeSerumLambda = double.parse(value!),
                          ),
                        ),
                      ),
                      SizedBox(height: deviceHeight * 0.02),

                      SizedBox(
                        width: deviceWidth * 0.5,
                        child: TextFormField(
                          keyboardType: const TextInputType.numberWithOptions(
                              decimal: true),
                          decoration: InputDecoration(
                            labelText: 'Free Serum Kappa Level',
                            labelStyle: TextStyle(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.bold),
                            border: const OutlineInputBorder(),
                            hintText: 'Enter numbers only in mg/L',
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter some value';
                            }
                            return null;
                          },
                          onSaved: (value) =>
                              freeSerumKappa = double.parse(value!),
                        ),
                      ),
                      SizedBox(height: deviceHeight * 0.02),
                      // NT-proBNP Question
                      SizedBox(
                        width: deviceWidth * 0.5,
                        child: TextFormField(
                          keyboardType: const TextInputType.numberWithOptions(
                              decimal: true),
                          decoration: InputDecoration(
                            labelText: 'N-terminal pro-Brain Natriuretic Peptide Level (NT-proBNP)',
                            labelStyle: TextStyle(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.bold),
                            border: const OutlineInputBorder(),
                            hintText: 'Enter numbers only in ng/L',
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter some value';
                            }
                            return null;
                          },
                          onSaved: (value) =>
                              NTproBNP = double.parse(value!),
                        ),
                      ),

                      SizedBox(height: deviceHeight * 0.02),
                       ElevatedButton(
  style: ElevatedButton.styleFrom(
    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
    backgroundColor: const Color(0xFF42A5F5), // Directly setting the background color
    foregroundColor: Colors.white, // Directly setting the text color
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(15),
    ),
    elevation: 3, // Directly setting elevation
    shadowColor: const Color.fromARGB(255, 30, 0, 255).withOpacity(0.5), // Directly setting shadow color
  ),
                        onPressed: _validateAndSave,
                        child: const Text("Calculate"),
                      ),
                      SizedBox(
                          height: deviceHeight * 0.05), // add vertical space
                      referenceTextWithLink(
                          "Muchtar E, Kumar SK, Gertz MA, Grogan M, AbouEzzeddine OF, Jaffe AS, Dispenzieri A. Staging systems use for risk stratification of systemic amyloidosis in the era of high-sensitivity troponin T assay. Blood. 2019 Feb 14;133(7):763-766. ",
                          "https://pubmed.ncbi.nlm.nih.gov/30545829/",
                          deviceWidth),
                      SizedBox(height: deviceHeight * 0.05),
                      if (deviceWidth > 600)
                        AuthorsSection(
                          authors: authors,
                          controller: controller,
                          deviceWidth: deviceWidth,
                          deviceHeight: deviceHeight,
                          factor: factor,
                        )
                    ])),
                  )
                ])))));
  }
}


class FrailtyCalculatorPage extends StatefulWidget {
  @override
  _FrailtyCalculatorPageState createState() => _FrailtyCalculatorPageState();
}

class _FrailtyCalculatorPageState extends State<FrailtyCalculatorPage> {
  final _formKey = GlobalKey<FormState>();
  int ageGroup = 0; // 0: <=75, 1: 76-80, 2: >80
  int cci = 0; // 0: <=1, 1: >1
  int ecog = 0; // 0: 0, 1: 1, 2: >=2
  String diagnosis = '';
  late PageController controller; // Moved controller to be a class member

  @override
  void initState() {
    super.initState();
    controller = PageController(viewportFraction: 0.95); // Initialize controller here
  }

  @override
  void dispose() {
    controller.dispose(); // Don't forget to dispose controller
    super.dispose();
  }

  void _validateAndSave() {
    final form = _formKey.currentState;
    if (form!.validate()) {
      form.save();
      _calculateDiagnosis();
    }
  }

  void _calculateDiagnosis() {
    int tally = ageGroup + cci + ecog;
    diagnosis = (tally <= 1) ? 'Non-frail' : 'Frail';

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Diagnosis Results"),
          content: Text(
            'Based on the provided information, the diagnosis is: $diagnosis.',
            style: TextStyle(fontWeight: FontWeight.bold), // Make the text bold
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Close'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }


  @override
  Widget build(BuildContext context) {
    final double deviceWidth = MediaQuery.of(context).size.width;
    final double deviceHeight = MediaQuery.of(context).size.height;
    final double factor = deviceWidth * 0.000390625;
    AuthorsService authorsService = AuthorsService(); // New instance

    final authors = authorsService.authors;

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF0D47A1),
                Color(0xFF1976D2),
                Color(0xFF42A5F5),
              ],
            ),
          ),
          child: AppBar(
            title: const Text('Frailty'),
            backgroundColor: Colors.transparent,
            elevation: 0,
            centerTitle: true,
          ),
        ),
      ),
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: deviceWidth * 0.1),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              children: [
                SizedBox(height: deviceHeight * 0.05),
                Text(
                  "Frailty Classification",
                  style: TextStyle(
                    fontSize: 36 + factor,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: deviceHeight * 0.02, ),
                        Text(
                          "Please respond to the following questions",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              color: Theme.of(context).colorScheme.primary,
                              fontSize: 15 + factor),
                        ),
                SizedBox(height: deviceHeight * 0.02),

                // Age Group Selection
                  // Age Group Selection
Container(
  width: deviceWidth * 0.5, // Set the width to half of the device width
  child: DropdownButtonFormField<int>(
    value: ageGroup,
    decoration: InputDecoration(
      labelText: 'Select Age Group',
      border: OutlineInputBorder(),
    ),
    items: [
      DropdownMenuItem(value: 0, child: Text("≤ 75")),
      DropdownMenuItem(value: 1, child: Text("76 - 80")),
      DropdownMenuItem(value: 2, child: Text("> 80")),
    ],
    onChanged: (value) => setState(() => ageGroup = value!),
  ),
),
SizedBox(height: deviceHeight * 0.02),

// CCI Selection
Container(
  width: deviceWidth * 0.5, // Set the width to half of the device width
  child: DropdownButtonFormField<int>(
    value: cci,
    decoration: InputDecoration(
      labelText: 'Charlson Comorbidity Index (CCI)',
      border: OutlineInputBorder(),
    ),
    items: [
      DropdownMenuItem(value: 0, child: Text("≤ 1")),
      DropdownMenuItem(value: 1, child: Text("> 1")),
    ],
    onChanged: (value) => setState(() => cci = value!),
  ),
),
SizedBox(height: deviceHeight * 0.02),

// ECOG Selection
Container(
  width: deviceWidth * 0.5, // Set the width to half of the device width
  child: DropdownButtonFormField<int>(
    value: ecog,
    decoration: InputDecoration(
      labelText: 'ECOG Performance Status',
      border: OutlineInputBorder(),
    ),
    items: [
      DropdownMenuItem(value: 0, child: Text("0")),
      DropdownMenuItem(value: 1, child: Text("1")),
      DropdownMenuItem(value: 2, child: Text("≥ 2")),
    ],
    onChanged: (value) => setState(() => ecog = value!),
  ),
),

                SizedBox(height: deviceHeight * 0.02),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF42A5F5),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  onPressed: _validateAndSave,
                  child: Text("Calculate"),
                ),
                SizedBox(height: deviceHeight * 0.05), // Add vertical space
                referenceTextWithLink(
                  "Facon, T., Dimopoulos, M.A., Meuleman, N. et al. A simplified frailty scale predicts outcomes in transplant-ineligible patients with newly diagnosed multiple myeloma treated in the FIRST (MM-020) trial. Leukemia 34, 224–233 (2020).",
                  "https://doi.org/10.1038/s41375-019-0539-0",
                  deviceWidth,
                ),
                SizedBox(height: deviceHeight * 0.05),
                if (deviceWidth > 600)
                  AuthorsSection(
                    authors: authors,
                    controller: controller,
                    deviceWidth: deviceWidth,
                    deviceHeight: deviceHeight,
                    factor: factor,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}



class WMCalculatorPage extends StatefulWidget {
  @override
  _WMCalculatorPageState createState() => _WMCalculatorPageState();
}

class _WMCalculatorPageState extends State<WMCalculatorPage> {
  final _formKey = GlobalKey<FormState>();
  int age = 0;
  double serumAlbumin = 0;
  bool elevatedLDH = false;
  late PageController controller;

  String riskClassification = '';
  String survivalRate = '';

  @override
  void initState() {
    super.initState();
    controller = PageController(viewportFraction: 0.95);
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

    void _calculateRisk() {
  // Trigger form validation
  if (_formKey.currentState!.validate()) {
    // If all data is valid, save form and proceed with risk calculation
    _formKey.currentState!.save();
    int score = 0;

// Correct age range
if (age > 75) {
  score += 2;
} else if (age >= 66 && age <= 75) {
  score += 1;
}

// Serum albumin condition
if (serumAlbumin < 3.5) {
  score += 1;
}

// Elevated LDH condition
if (elevatedLDH) {
  score += 2;
}

// Risk classification and survival rate
if (score == 0) {
  riskClassification = 'Low-risk';
  survivalRate = '93%';
} else if (score == 1) {
  riskClassification = 'Low-intermediate risk';
  survivalRate = '82%';
} else if (score == 2) {
  riskClassification = 'Intermediate-risk';
  survivalRate = '69%';
} else {
  riskClassification = 'High-risk';
  survivalRate = '55%';
}


    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Risk Classification"),
          content: Text(
            'Based on the provided information, the risk classification is: $riskClassification.\n5-year overall survival (OS) rate: $survivalRate.',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Close'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
    }

  @override
  Widget build(BuildContext context) {
    final double deviceWidth = MediaQuery.of(context).size.width;
    final double deviceHeight = MediaQuery.of(context).size.height;
    final double factor = deviceWidth * 0.000390625;
    AuthorsService authorsService = AuthorsService();
    final authors = authorsService.authors;

    return Scaffold(
    appBar: PreferredSize(
      preferredSize: const Size.fromHeight(kToolbarHeight),
      child: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0D47A1),
              Color(0xFF1976D2),
              Color(0xFF42A5F5),
            ],
          ),
        ),
        child: AppBar(
          title: const Text('Waldenström Macroglobulinemia'),
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
        ),
      ),
    ),
    body: Align(
      alignment: Alignment.topCenter, // Align content to the top center
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: deviceWidth * 0.1),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(height: deviceHeight * 0.05),
                Text(
                  "Waldenström Macroglobul. Risk Calculator",
                  style: TextStyle(
                    fontSize: 36 + factor,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: deviceHeight * 0.02),
                // Instructions text
                Text(
                  "Please respond to the following questions based on your most recent lab results.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                    fontSize: 15 + factor,
                  ),
                ),
                SizedBox(height: deviceHeight * 0.02),
                // Age input field
                // Age input field with validation
buildInputField(
  context: context,
  label: 'Enter your age',
  keyboardType: TextInputType.number,
  onSave: (value) => age = int.tryParse(value ?? '0') ?? 0,
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your age';
    }
    if (int.tryParse(value) == null) {
      return 'Please enter a valid number';
    }
    return null; // input is valid
  },
  hintText: 'Enter your age in years', // This is the added hint text
),

SizedBox(height: deviceHeight * 0.02),

// Serum albumin level input field with validation
buildInputField(
  context: context,
  label: 'Enter your serum albumin level (g/dL)',
  keyboardType: TextInputType.numberWithOptions(decimal: true),
  onSave: (value) => serumAlbumin = double.tryParse(value ?? '0') ?? 0,
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your serum albumin level';
    }
    if (double.tryParse(value) == null) {
      return 'Please enter a valid number';
    }
    return null; // input is valid
  },
  hintText: 'Enter in g/dL', // Added hint text to guide users
),


                // Elevated LDH switch
               Container(
  width: deviceWidth * 0.5, // Sets the container's width to half of the device width
  child: SwitchListTile(
    title: Text(
      'Is your serum LDH (U/L) above the normal upper limit?', // The question presented to the user
      style: TextStyle(fontWeight: FontWeight.bold), // Makes the text bold
    ),
    subtitle: Text(
      'Please switch on if your LDH levels are above the normal range.', // Additional instruction
    ),
    value: elevatedLDH, // The current state of the switch (true or false)
    onChanged: (bool value) {
      setState(() => elevatedLDH = value); // Updates the state based on the switch
    },
  ),
),

                // Calculate Risk button
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF42A5F5),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  onPressed: _calculateRisk,
                  child: Text('Calculate Risk'),
                ),
                SizedBox(height: deviceHeight * 0.05),
                referenceTextWithLink(
                          "Zanwar, S., Le-Rademacher, J., Durot, E., D’Sa, S., Abeykoon, J. P., Mondello, P., Kumar, S., Sarosiek, S., Paludo, J., Chhabra, S., Cook, J. M., Parrondo, R., Dispenzieri, A., Gonsalves, W. I., Muchtar, E., Ailawadhi, S., Kyle, R. A., Rajkumar, S. V., Delmer, A., . . . Kapoor, P. (2024). Simplified Risk Stratification Model for Patients With Waldenström Macroglobulinemia. Journal of Clinical Oncology.",
                          "https://doi.org/10.1200/jco.23.02066",
                          deviceWidth),
                SizedBox(height: deviceHeight * 0.05),
                if (deviceWidth > 600)
                  AuthorsSection(
                    authors: authors,
                    controller: controller,
                    deviceWidth: deviceWidth,
                    deviceHeight: deviceHeight,
                    factor: factor,
                  ),
                  ],
            ),
          ),
        ),
      ),
    ),
  );
}
}

    
Widget buildInputField({
  required BuildContext context,
  required String label,
  required TextInputType keyboardType,
  required Function(String?) onSave,
  String? Function(String?)? validator, // Existing validator parameter
  String? hintText, // Adding the hintText parameter
}) {
  final double deviceWidth = MediaQuery.of(context).size.width; // Device width for setting container width
  return Container(
    width: deviceWidth * 0.5, // Set the width of the container to half the device width
    child: TextFormField(
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(),
        hintText: hintText, // Use hintText in the decoration to display the hint inside the input field
      ),
      keyboardType: keyboardType,
      onSaved: onSave,
      validator: validator, // Use the validator if provided
    ),
  );
}





class _AuthorsPage extends StatefulWidget {
  @override
  _AuthorsPageState createState() => _AuthorsPageState();
}

class _AuthorsPageState extends State<_AuthorsPage> {
  @override
  Widget build(BuildContext context) {
    final authorsService = AuthorsService();
    
    final authors = authorsService.authors;

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF0D47A1),
                Color(0xFF1976D2),
                Color(0xFF42A5F5),
              ],
            ),
          ),
          child: AppBar(
            title: const Text('Developers'),
            backgroundColor: Colors.transparent,
            elevation: 0,
            centerTitle: true,
          ),
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(
            // Add your background image or pattern here
            ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'Meet Our Team',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
              ),
              Divider(
                color: Theme.of(context).colorScheme.primary,
              ),
              Expanded(
  child: ListView.builder(
    itemCount: authors.length,
    itemBuilder: (context, index) {
      return Card(
        color: Colors.white, // Set the background color of the card to white
        elevation: 5,
        child: ListTile(
          leading: CircleAvatar(
            backgroundImage: AssetImage(authors[index]['image']),
          ),
          title: Row(
            children: [
              Text(
                authors[index]['name'],
                style: TextStyle(
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.linked_camera_outlined,
                color: Theme.of(context).colorScheme.primary,
              ),
            ],
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(authors[index]['title']),
              const SizedBox(height: 4),
              Text(
                'Skills: ${authors[index]['skills']}',
                style: const TextStyle(fontSize: 12),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.email, size: 12),
                  const SizedBox(width: 4),
                  Text(
                    authors[index]['email'],
                    style: const TextStyle(fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.link, size: 12),
                  const SizedBox(width: 4),
                  Text(
                    authors[index]['twitter'],
                    style: const TextStyle(fontSize: 12),
                  ),
                ],
              ),
            ],
          ),
                        onTap: () {
                          showDialog(
                            context: context,
                            builder: (context) {
                              return AlertDialog(
                                title: Text(authors[index]['name']),
                                content: Text(authors[index]['bio']),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text('Close'),
                                  ),
                                ],
                              );
                            },
                          );
                        },
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
