const home = async (req, res) => {
    try {
        res.status(200).json({ message: 'Hello World'});
    } catch ( err ) {
        res.status(400).json({ message: err.message });
    }
}

export default home;