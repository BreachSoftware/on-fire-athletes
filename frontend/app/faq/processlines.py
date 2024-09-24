import re

def pretty_print_array(array):
    # Convert each string in the array to a double-quoted string
    formatted_elements = [f'"{escape_quotes(element)}"' for element in array]
    # Join the elements with commas and newlines
    formatted_string = ',\n'.join(formatted_elements)
    # Print the array with newlines between elements
    print(f'[\n{formatted_string}\n]')
    
def escape_quotes(text):
    # Replace double quotes with escaped double quotes
    return text.replace('"', '\"')

def multiline_to_array(multiline_string):
    # Split the string by two consecutive newlines to create array elements
    sections = re.split(r'\n\s*\n', multiline_string)

    # For each section, replace single newlines with spaces, then clean extra spaces
    cleaned_sections = [' '.join(section.replace('\n', ' ').split()) for section in sections]
    
    return cleaned_sections

# Example usage
multiline_string = """Last Modified: August 16, 2024

OnFire Athletes uses cookies on its website and our digital
applications.

This Cookie Policy describes our policy with respect to information, including 
information that can be associated with a specific person and could be used 
to identify that person ("Personal Data"), that is collected from Users 
through cookies, pixel tags, local shared objects, web storage and other 
similar technologies.

Please also refer to our Privacy Policy (incorporated by reference), which 
details our policy with respect to the collection, use, disclosure, transfer and 
storage of information, including Personal Data, that is collected from Users. 
Nothing in this Cookie Policy shall be deemed to modify, waive, amend or 
rescind any other term of the Privacy Policy.

Consent

By using our digital platform (“Platform”), you are consenting to the use of 
the technologies described in this Cookie Policy to collect both Personal Data 
and non-Personal Data and to the storage of information on your device or 
web browser as described in this Cookie Policy.
What are cookies, pixel tags (AKA clear GIFs or web 
beacons), local shared objects, and web storage?

Cookies

Cookies are small data files that your browser sets on your computer or 
device. A cookie itself does not contain or collect information. However, 
when it is read by a server via a web browser, it can help a website deliver a 
more user-friendly service—for example, remembering previous purchases or
account details.

Pixel Tags (aka Clear GIFs or Web Beacons).

A pixel tag is a tiny invisible tag or graphic placed on certain parts of our 
Platform, in emails or in certain other downloadable content, but not on your 
computer, mobile device or browser, unless you download the content that 
contains such tags.

Local Shared Objects (aka Flash Cookies).

A local shared object is like a cookie, except it is stored on your computer or 
mobile device, instead of your browser, and it can store more than just text. 
The methods for controlling local shared objects are different than the 
methods for controlling cookies (as discussed below).

How can I manage these technologies?

Cookies

Cookies may be session cookies (meaning they last only for one browser 
session) or persistent cookies (meaning they continue on your browser until 
they are deleted). You can manage cookies through your web browser's 
option settings and through those settings you may be able (a) to receive 
notifications when you are receiving new cookies; (b) to disable cookies; or 
(c) to delete cookies. Please refer to your web browser's help section for 
information on how to do this.

Pixel Tags

Pixel tags do not store information on your computer, mobile device or 
browser (although they are occasionally downloaded to your computer if 
contained in an email or other downloadable content) so they cannot be 
managed by you except by deleting the content in which the tag is 
contained.

Local Shared Objects

Local shared objects are stored on your computer or mobile device.

Web Storage

Web Storage, or HTML5 Local Storage, is an industry-standard data storage 
technology that is implemented by internet browser providers. Refer to your 
browser's help contents for procedures on how to manage settings for Web 
Storage.

The Technologies used by OnFire Athletes fall into four 
categories.

Essential (necessary)

We use these technologies to enable technical site functionality and to 
provide services explicitly requested by you, like your personal preferences, 
and for security and fraud prevention.

Performance/Analytics

We use these technologies to collect information about how visitors use and 
experience our website to optimize design, operations, efficiency and to 
improve your user experience. For example, we may place cookies that allow
us (a) to measure the time of your requests to our servers and our 
responses; (b) to compare new features to old ones; (c) to record statistics 
about Platform usage; (d) to track your activities on our Platform; and (e) to 
track the places from which you come to our Platform.
We may also use third party cookies to collect information about visitor 
behavior on our Platform for these Performance/Analytics purposes.

Functionality

We use these technologies to allow us to provide certain functionality to our 
Platform and to remember your preferences. For instance, when you click the
"remember me" box on our log in page we place a persistent cookie on your 
browser that allows our Services to pre-populate your username when you 
return.

Advertising

We may use these technologies to deliver advertisements to you both on and
off our Platform. By using these technologies we expect to better shape any 
advertisements to your interests. Sometimes this is called online behavioral, 
interest based or retargeted advertising. In the event we engage in a third-
party service provider for these technologies, we will update our policy to let 
you know who they are. You can manage your opt-outs for those third-party 
service providers who participate in such opt-out frameworks. Not every one 
of these third-party service providers may always participate in every 
voluntary framework, so you may need to access their individual opt out 
frameworks so you can control your preferences directly with those 
providers.

Does anybody else use these technologies on your 
services?

Most of the cookies and other technologies described above on our Services 
are set by us (aka first-party cookies) or are used in connection with our 
Platform and set by third-party service providers at our direction ("Third 
Party Cookies"). We may use Third Party Cookies with respect to each of the 
uses detailed above."""

lines_array = multiline_to_array(multiline_string)
pretty_print_array(lines_array)
# print(' '.join(multiline_string.replace('\n', ' ').replace('\t', ' ').split()))
