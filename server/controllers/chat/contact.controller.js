const Conversation = require('../../models/conversation');
const User = require('../../models/user');
const Message = require('../../models/message');

//tạo conversation
module.exports.createConversation = async (req, res) => {
    try {
        const { id } = req.body;
        const contactUser = await User.findById(id).exec();
        const currentUser = req.user;

        if (contactUser._id.toString() === currentUser._id.toString()) {
            return res.status(404).json({
                status: 'error',
                status_code: 404,
                message: 'Something went wrong',
            });
        }

        const checkConversation = await Conversation.findOne({
            $or: [
                {
                    $and: [
                        { userId: currentUser._id, contactId: contactUser._id },
                    ],
                },
                {
                    $and: [
                        { userId: contactUser._id, contactId: currentUser._id },
                    ],
                },
            ],
        });

        if (checkConversation) {
            return res.status(422).json({
                status: 'error',
                status_code: 422,
                message: 'Something went wrong',
            });
        }

        const conversation = await Conversation.create({
            userId: currentUser._id,
            contactId: contactUser._id,
        });

        res.json({
            status: 'success',
            status_code: 200,
            message: 'success',
            data: { conversation },
        });
    } catch (error) {
        return res.status(422).json({
            status: 'error',
            status_code: 422,
            message: error,
        });
    }
};

//get conversation
module.exports.getConversations = async (req, res) => {
    try {
        const currentUser = req.user;
        const perPage = parseInt(req.query.perPage) || 15;
        const currentPage = parseInt(req.query.page) || 1;

        const conversation = await Conversation.find({
            $or: [
                {
                    userId: currentUser._id,
                },
                {
                    contactId: currentUser._id,
                },
            ],
        })
            .sort({ updatedAt: -1 })
            .skip(perPage * (currentPage - 1))
            .limit(perPage)
            .populate('userId', '_id name avatar')
            .populate('contactId', '_id name avatar')
            .lean();
        if (conversation) {
            const messageQuery = conversation.map((item, index) => {
                return Message.findOne({
                    conversationId: item._id,
                })
                    .sort({ createdAt: -1 })
                    .populate('sender', '_id name avatar');
            });

            Promise.all(messageQuery)
                .then(async (message) => {
                    for (let i = 0; i < conversation.length; i++) {
                        conversation[i]['lastest_chat'] = message[i];
                    }

                    let total = await Conversation.count({});

                    res.json({
                        status: 'success',
                        status_code: 200,
                        data: {
                            conversations: conversation,
                        },
                        page: currentPage,
                        perPage,
                        total_page: Math.ceil(total / perPage),
                        total,
                    });
                })
                .catch((error) => {
                    return res.status(422).json({
                        status: 'success',
                        status_code: 422,
                        message: error,
                    });
                });
        }
    } catch (error) {
        return res.status(422).json({
            status: 'error',
            status_code: 422,
            message: error,
        });
    }
};

module.exports.checkExistConversation = async (req, res) => {
    try {
        const currentUser = req.user;
        const { id } = req.body;
        const contactUser = await User.findById(id).exec();

        if (currentUser._id.toString() === contactUser._id.toString()) {
            return res.status(404).json({
                status: 'error',
                status_code: 404,
                message: 'Something went wrong',
            });
        }

        const checkConversation = await Conversation.findOne({
            $or: [
                {
                    $and: [
                        { userId: currentUser._id, contactId: contactUser._id },
                    ],
                },
                {
                    $and: [
                        { userId: contactUser._id, contactId: currentUser._id },
                    ],
                },
            ],
        })
            .populate('userId', '_id name avatar')
            .populate('contactId', '_id name avatar');

        if (checkConversation) {
            return res.json({
                status: 'success',
                status_code: 422,
                message: 'exist conversation',
                data: {
                    conversation: checkConversation,
                },
            });
        } else {
            return res.status(422).json({
                status: 'error',
                status_code: 422,
                message: 'Not exist conversation',
            });
        }
    } catch (error) {
        return res.status(422).json({
            status: 'error',
            status_code: 422,
            message: error,
        });
    }
};

module.exports.conversationDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const perPage = parseInt(req.query.perPage) || 15;
        const currentPage = parseInt(req.query.page) || 1;

        const conversation = await Conversation.findById(id).lean();

        await Message.updateMany(
            {
                conversationId: conversation._id,
                receiver: req.user._id,
            },
            { is_read: true }
        );

        const message = await Message.find({
            conversationId: conversation._id,
        })
            .sort({ createdAt: -1 })
            .skip(perPage * (currentPage - 1))
            .limit(perPage)
            .populate('sender', '_id name avatar');

        const total = await Message.count({
            conversationId: conversation._id,
        });

        conversation['message'] = message.reverse();

        res.json({
            status: 'success',
            status_code: 200,
            message: 'success',
            data: {
                conversation,
                pagination: {
                    page: currentPage,
                    total_page: Math.ceil(total / perPage),
                    total: total,
                },
            },
        });
    } catch (error) {
        return res.status(422).json({
            status: 'error',
            status_code: 422,
            message: error,
        });
    }
};

module.exports.createMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { conversationType } = req.body;

        const sender = await User.findById(req.user._id);

        if (conversationType == 'Conversation') {
            const conversation = await Conversation.findById(id).lean();
            if (conversation) {
                // const conversation = await Conversation.findById(id).lean();

                let receiver =
                    conversation.userId.toString() !== req.user._id.toString()
                        ? conversation.userId
                        : conversation.contactId;
                const user = await User.findById(receiver).lean();

                if (user) {
                    let message = await Message.create({
                        ...req.body,
                        receiver,
                        sender: sender._id,
                        conversationId: conversation._id,
                    });

                    message
                        .populate('sender', '_id avatar name')
                        .execPopulate()
                        .then((result) => {
                            conversation['message'] = result;

                            res.json({
                                status: 'success',
                                status_code: 200,
                                message: 'success',
                                data: {
                                    conversation,
                                },
                            });
                        });
                }
            }
        }
    } catch (error) {
        return res.status(422).json({
            status: 'error',
            status_code: 422,
            message: error,
        });
    }
};

exports.deleteConversation = async (req, res) => {
    try {
        console.log(req.body);
        const { id } = req.body;
        console.log(id);
        let messageQuery = Message.remove({ conversationId: { $in: id } });
        let conversationQuery = Conversation.remove({ _id: { $in: id } });

        Promise.all([messageQuery, conversationQuery])
            .then((result) => {
                if (result[0].deletedCount > 0 && result[1].deletedCount > 0) {
                    res.json({
                        status: 'success',
                        status_code: 200,
                        message: 'Xóa thành công cuộc trò chuyện',
                    });
                } else {
                    res.status(422).json({
                        status: 'error',
                        status_code: 422,
                        message: 'Xóa không thành công !',
                    });
                }
            })
            .catch((error) => {
                return res.status(422).json({
                    status: 'error',
                    status_code: 422,
                    message: error,
                });
            });
    } catch (error) {
        return res.status(422).json({
            status: 'error',
            status_code: 422,
            message: error,
        });
    }
};
