CREATE DATABASE akeno_debug; 

CREATE TABLE `akeno_debug`.`users`( 
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    `dscr_id` VARCHAR(64) NOT NULL,
    `server_fk` INT(5) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE `akeno_debug`.`servers`(
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `dscr_id` VARCHAR(64) NOT NULL,
    /* when instantiating table leave this as null.
    otherwise, you cant insert anything to the table as this becomes loop - 
    server requires user and user requires server*/
    `admin_fk` INT(5) NULL,
    `server_conf_fk` INT(5) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE `akeno_debug`.`server_conf`(
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `admin_role` VARCHAR(32) NULL DEFAULT NULL,
    `flags` int(6) NOT NULL DEFAULT '32767',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE `akeno_debug`.`user_stats`(
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `user_fk` INT(5) NOT NULL,
    `pats` INT(5) NOT NULL DEFAULT '0',
    `thanks` INT(5) NOT NULL DEFAULT '0',
    `honors` INT(5) NOT NULL DEFAULT '0',
    `spare_honors` INT(32) NOT NULL DEFAULT '15',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

ALTER TABLE `akeno_debug`.`users` ADD FOREIGN KEY (`server_fk`) REFERENCES `akeno_debug`.`servers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `akeno_debug`.`servers` ADD FOREIGN KEY (`admin_fk`) REFERENCES `akeno_debug`.`users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `akeno_debug`.`servers` ADD FOREIGN KEY (`server_conf_fk`) REFERENCES `akeno_debug`.`server_conf`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `akeno_debug`.`user_stats` ADD FOREIGN KEY (`user_fk`) REFERENCES `akeno_debug`.`users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;


INSERT INTO `akeno_debug`.`server_conf` (`id`, `admin_role`) VALUES (NULL, 'AkenoDev');
INSERT INTO `akeno_debug`.`servers` (`id`, `dscr_id`, `admin_fk`, `server_conf_fk`) VALUES (NULL, '414414057060433920', NULL, '1');
INSERT INTO `akeno_debug`.`users` (`id`, `name`, `dscr_id`, `server_fk`) VALUES (NULL, 'Akeno', '429672169203695616', '1');
INSERT INTO `akeno_debug`.`user_stats` (`id`, `user_fk`, `pats`, `thanks`, `honors`, `spare_honors`) VALUES (NULL, '1', DEFAULT, DEFAULT, DEFAULT, DEFAULT);
/* After inserting all rows, update server admin_fk */
UPDATE `akeno_debug`.`servers` SET `admin_fk` = '1' WHERE `akeno_debug`.`servers`.`id` = 1;


/* Image storing */

CREATE TABLE `akeno_debug`.`images`(
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `server_fk` INT(5) NOT NULL,
    `author_id` VARCHAR(64) NOT NULL,
    `title` VARCHAR(32) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `is_global` TINYINT(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

ALTER TABLE `akeno_debug`.`images` ADD FOREIGN KEY (`server_fk`) REFERENCES `akeno_debug`.`servers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

/* Add some global images */
INSERT INTO `akeno_debug`.`images` (`id`, `server_fk`, `author_id`, `title`, `url`, `is_global`) 
VALUES (NULL, '1', '0', 'speechless', 'https://media.discordapp.net/attachments/430073596698820638/442659724966494208/YAGpXPd.png', '1');
INSERT INTO `akeno_debug`.`images` (`id`, `server_fk`, `author_id`, `title`, `url`, `is_global`) 
VALUES (NULL, '1', '0', 'suspicious fry', 'https://media.discordapp.net/attachments/430073596698820638/442673458388926465/giphy.gif', '1');
INSERT INTO `akeno_debug`.`images` (`id`, `server_fk`, `author_id`, `title`, `url`, `is_global`) 
VALUES (NULL, '1', '0', 'you are pervert', 'https://media.discordapp.net/attachments/430073596698820638/442673792507183125/90a.gif', '1');
INSERT INTO `akeno_debug`.`images` (`id`, `server_fk`, `author_id`, `title`, `url`, `is_global`) 
VALUES (NULL, '1', '0', 'smiling zero two', 'https://media.discordapp.net/attachments/430073596698820638/442674084502044674/SmillingZeroTwo.png', '1');

/* Video storing */

CREATE TABLE `akeno_debug`.`videos`(
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `server_fk` INT(5) NOT NULL,
    `author_id` VARCHAR(64) NOT NULL,
    `title` VARCHAR(32) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `is_global` TINYINT(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

ALTER TABLE `akeno_debug`.`videos` ADD FOREIGN KEY (`server_fk`) REFERENCES `akeno_debug`.`servers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

/* Add some global videos */
INSERT INTO `akeno_debug`.`videos` (`id`, `server_fk`, `author_id`, `title`, `url`, `is_global`) 
VALUES (NULL, '1', '0', 'hasuki waifu', 'https://cdn.discordapp.com/attachments/507985032288141322/527807722729635840/2018-12-27_12-18-08.mp4', '1');